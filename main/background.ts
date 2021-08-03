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

require("@electron/remote/main").initialize();

const isProd: boolean = process.env.NODE_ENV === "production";
// Indicate whether remote ssh is running
let isStarted = false;
// List of workers which will be used for action running
let workers: WorkerStatus[] = [];
let cancelableRemoteJob: CancelablePromise<any> | undefined;
let cancelableWorkerCheckingJob: CancelablePromise<any> | undefined;

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
  console.log("Start processing actions", filename, "with env", env);
  // Set environment variables based on the env
  if (env) {
    for (const [key, value] of Object.entries(env)) {
      process.env[key] = value;
    }
  }

  if (isStarted === true) {
    event.reply(
      "error",
      "cannot start this action. Reason: Already has started action."
    );
  } else {
    new Notification({ title: "Start running workers" }).show();
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
          isStarted = false;
          event.reply("status", isStarted);
        });

      isStarted = true;
      event.reply("status", isStarted);
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
  isStarted = !cancelableRemoteJob.isCanceled();
  event.reply("status", isStarted);
});

/**
 * Start worker checking
 */
ipcMain.on(
  "start-worker-checking",
  async (
    event,
    workers: Worker[],
    pluginNames: string[],
    condition: WorkerCondition<Web3PluginAcceptType>,
    concurrency: number
  ) => {
    let plugins = getPluginsByName(pluginNames);
    let checker = new WorkerChecker(plugins, concurrency);
    await checker.doChecking(workers, condition, {
      onDone: (status, remoteIndex, pluginIndex) => {
        // Worker status, remote worker index, plugin index, isDone
        event.reply("checker-status", status, remoteIndex, pluginIndex, false);
      },
    });

    event.reply("checker", undefined, workers.length, undefined, true);
  }
);
