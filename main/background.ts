import { app, ipcMain } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import { ConfigParser, WorkerStatus } from "remote-ssh";
import { cancelable, CancelablePromise } from "cancelable-promise";
import Logger from "remote-ssh/dist/logger";
import { onWorkerCommand, onWorkerError } from "./helpers/worker-callbacks";

const isProd: boolean = process.env.NODE_ENV === "production";
// Indicate whether remote ssh is running
let isStarted = false;
// List of workers which will be used for action running
let workers: WorkerStatus[] = [];
let cancelableJob: CancelablePromise<any> | undefined;

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

ipcMain.on("start", async (event, filename) => {
  console.log("Start processing actions", filename);
  if (isStarted === true) {
    event.reply(
      "error",
      "cannot start this action. Reason: Already has started action."
    );
  } else {
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
      cancelableJob = config.runRemoteCommand({
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

      cancelableJob
        .then((results) => {
          Logger.info("Action finished");
          event.reply("finish", results);
        })
        .catch((err) => event.reply("error", err))
        .finally(() => {
          isStarted = false;
          event.reply("status", isStarted);
        });

      isStarted = true;
      event.reply("status", isStarted);
    } catch (err) {
      event.reply("error", err);
    }
  }
});

ipcMain.on("stop", (event) => {
  Logger.info("Stopped");
  cancelableJob.cancel();
  isStarted = !cancelableJob.isCanceled();
  event.reply("status", isStarted);
});
