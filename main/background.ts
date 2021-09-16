import { app, ipcMain, Notification } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import { ConfigParser, WorkerStatus } from "remote-ssh";
import { cancelable, CancelablePromise } from "cancelable-promise";
import Logger from "remote-ssh/dist/logger";
import { onWorkerCommand, onWorkerError } from "./helpers/worker-callbacks";
import {
  Web3PluginAcceptType,
  Worker,
  WorkerChecker,
  WorkerCondition,
} from "worker-checking";
import { getPluginsByName } from "./helpers/worker-checking-utils";
import { WorkerStatus as WorkerCheckingStatus } from "worker-checking";
import { BlockExporter } from "block-exporter";

require("@electron/remote/main").initialize();

const isProd: boolean = process.env.NODE_ENV === "production";

// Indicate whether remote ssh is running
let isRemoteSSHStarted = false;

// Indicate whether worker checker is running
let isWorkerCheckerStarted = false;
let isBlockExporterStarted = false;

// List of workers which will be used for action running
let workers: WorkerStatus[] = [];

// Cancelable promises, used to stop jobs
let cancelableRemoteJob: CancelablePromise<any> | undefined;
let cancelableWorkerCheckingJob: CancelablePromise<any> | undefined;
let cancelableBlockExporterJob: CancelablePromise<any> | undefined;

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow("Remote Config", {
    width: 1000,
    height: 600,
  });

  if (isProd) {
    await mainWindow.loadURL("app://./home.html");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on("window-all-closed", () => {
  app.quit();
});

/// Start running remote-config
ipcMain.on("start", async (event, filename, env: { [key: string]: string }) => {
  // Set environment variables based on the env
  if (env) {
    for (const [key, value] of Object.entries(env)) {
      process.env[key] = value;
    }
  }

  if (isRemoteSSHStarted === true) {
    event.reply(
      "error",
      "cannot start this action. Reason: Already has started action."
    );
  } else {
    new Notification({ title: "Start running workers" }).show();

    // Get configuration from file
    let config = new ConfigParser({ filePath: filename, concurrency: 1 });
    try {
      // Read configuration
      config.readFile();

      // Create a list of workers
      workers = config.config.remote.map((r) => {
        return {
          remoteIP: r,
          // -1 means remote is connecting
          currentProgress: -1,
          results: [],
          outputs: [],
          totalOutputs: [],
          errors: [],
          errorStopped: false,
          isFinished: false,
        };
      });

      // Send the list of workers back to the render
      // Update event will includes the list of workers
      event.reply("update", workers);

      // Create a cancelable promise
      cancelableRemoteJob = config.runRemoteCommand({
        onCommandEnd(index: number, command: string, progress: number) {
          workers[index].currentProgress = workers[index].currentProgress + 1;
          event.reply("update", workers);
        },
        onCommandOutput(index: number, progress: number, output: string) {
          Logger.info("Get command progress " + progress);
          workers[index] = onWorkerCommand(
            index,
            progress,
            output,
            workers[index]
          );
          event.reply("update", workers);
        },
        onError(
          err: any,
          index,
          progress: number,
          command: string,
          errorStopped: boolean
        ) {
          Logger.error(index);
          // Update worker
          workers[index] = onWorkerError(
            index,
            progress,
            err,
            errorStopped,
            workers[index]
          );
          event.reply("update", workers);
        },
      });

      cancelableRemoteJob
        .then((results) => {
          Logger.info("Action finished");
          new Notification({
            title: "Jobs finished!",
            subtitle: `${workers.length} workers' jobs are finished`,
          }).show();
          event.reply("finish", results);
        })
        .catch((err) => event.reply("error", err))
        .finally(() => {
          /// Clear env
          if (env) {
            for (const [key, value] of Object.entries(env)) {
              delete process.env[key];
            }
          }
          isRemoteSSHStarted = false;
          event.reply("status", isRemoteSSHStarted);
        });

      isRemoteSSHStarted = true;
      event.reply("status", isRemoteSSHStarted);
    } catch (err) {
      new Notification({
        title: "Worker has an error. Check Worker tag!",
      }).show();
      event.reply("error", err);
    }
  }
});

/**
 * Stop remote config
 */
ipcMain.on("stop", (event) => {
  Logger.info("Stopped");
  new Notification({ title: "Workers stopped" }).show();
  cancelableRemoteJob.cancel();
  isRemoteSSHStarted = !cancelableRemoteJob.isCanceled();
  event.reply("status", isRemoteSSHStarted);
});

/**
 * Start worker checking
 */
ipcMain.on(
  "start-worker-checking",
  async (
    event,
    remotes: string[],
    pluginNames: string[],
    condition: WorkerCondition<Web3PluginAcceptType>,
    concurrency: number
  ) => {
    let workers: Worker[] = remotes.map((r) => {
      return { remote: r };
    });

    // Initialize a list of worker status
    let foundWorkers: WorkerCheckingStatus[] = [];

    // initialize a variable to track current progress
    let progress = 0;

    isWorkerCheckerStarted = true;
    event.reply("checker-start-status", isWorkerCheckerStarted);

    let plugins = getPluginsByName(pluginNames);
    let checker = new WorkerChecker(plugins, concurrency);
    cancelableWorkerCheckingJob = checker.doChecking(workers, condition, {
      onDone: (status, remoteIndex, pluginIndex) => {
        foundWorkers.push(status);
        progress = remoteIndex;

        // send found workers, remote index, and is finished back to renderer
        event.reply("checker-status", foundWorkers, progress, false);
      },
    });

    cancelableWorkerCheckingJob
      .then(() => {
        console.log("Finished");
        event.reply("checker-status", foundWorkers, workers.length, true);
      })
      .catch((err) => {
        event.reply("checker-status", foundWorkers, progress, true);
        new Notification({
          title: "Worker Checker error",
          subtitle: err.toString(),
        }).show();
      })
      .finally(() => {
        isWorkerCheckerStarted = false;
        event.reply("checker-start-status", isWorkerCheckerStarted);
        new Notification({
          title: "Finished",
          subtitle: "Worker Checker Finished",
        }).show();
      });
  }
);

ipcMain.on("stop-worker-checking", (event) => {
  cancelableWorkerCheckingJob?.cancel();
  isWorkerCheckerStarted = false;
  event.reply("checker-start-status", isWorkerCheckerStarted);
});

ipcMain.on(
  "block_exporter_start",
  (e, { host, port, output, concurrency }: any) => {
    let blockExporter = new BlockExporter(host, port, output, concurrency);
    isBlockExporterStarted = true;
    e.reply("block-exporter-status-changed", isBlockExporterStarted);

    cancelableBlockExporterJob = blockExporter.check(
      (current, total, blockData) => {
        e.reply("block-exporter-update", { current, total, blockData });
      },
      (err) => {
        e.reply("block-exporter-error", err);
      }
    );

    cancelableBlockExporterJob
      .then(() => {
        isBlockExporterStarted = false;
        e.reply("block-exporter-status-changed", isBlockExporterStarted);
        new Notification({
          title: "Finished",
          subtitle: "Block Exporter",
        }).show();
      })
      .catch((err) => {
        isBlockExporterStarted = false;
        e.reply("block-exporter-status-changed", isBlockExporterStarted);
        e.reply("block-exporter-error", err);
      });
  }
);

ipcMain.on("block_exporter_stop", (e) => {
  cancelableBlockExporterJob?.cancel();
  isBlockExporterStarted = false;
  e.reply("block-exporter-status-changed", isBlockExporterStarted);
});
