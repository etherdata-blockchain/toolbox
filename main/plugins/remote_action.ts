import { ipcMain, Notification } from "electron";
import Logger from "@etherdata-blockchain/logger";
import { CancelablePromise } from "cancelable-promise";
import { WorkerStatus } from "@etherdata-blockchain/remote-action";
import { onWorkerCommand, onWorkerError } from "../helpers/worker-callbacks";
import { ElectronChannels, RemoteActionEvents } from "../../shared/event_names";
import ConfigParser from "@etherdata-blockchain/remote-action/dist/config";
import Remote from "@etherdata-blockchain/remote-action/dist/remote";

// Indicate whether remote ssh is running
let isRemoteSSHStarted = false;
// Cancelable promises, used to stop jobs
let cancelableRemoteJob: CancelablePromise<any> | undefined;
// List of workers which will be used for action running
let workers: WorkerStatus[] = [];

/// Start running remote action
ipcMain.on(
  ElectronChannels.startRemoteAction,
  async (event, filename, env: { [key: string]: string }) => {
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
        // Update event will include the list of workers
        event.reply(RemoteActionEvents.onRemoteActionUpdate, workers);

        // Create a cancelable promise
        cancelableRemoteJob = config.runRemoteCommand({
          onCommandEnd(index: number, command: string, progress: number) {
            workers[index].currentProgress = workers[index].currentProgress + 1;
            event.reply(RemoteActionEvents.onRemoteActionUpdate, workers);
          },
          onCommandOutput(index: number, progress: number, output: string) {
            Logger.info("Get command progress " + progress);
            workers[index] = onWorkerCommand(
              index,
              progress,
              output,
              workers[index]
            );
            event.reply(RemoteActionEvents.onRemoteActionUpdate, workers);
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
            event.reply(RemoteActionEvents.onRemoteActionUpdate, workers);
          },
        });

        cancelableRemoteJob
          .then((results) => {
            Logger.info("Action finished");
            new Notification({
              title: "Jobs finished!",
              subtitle: `${workers.length} workers' jobs are finished`,
            }).show();
            event.reply(RemoteActionEvents.onRemoteActionFinish, results);
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
            event.reply(
              RemoteActionEvents.onRemoteActionStatus,
              isRemoteSSHStarted
            );
          });

        isRemoteSSHStarted = true;
        event.reply(
          RemoteActionEvents.onRemoteActionStatus,
          isRemoteSSHStarted
        );
      } catch (err) {
        new Notification({
          title: "Worker has an error. Check Worker tag!",
        }).show();
        event.reply(RemoteActionEvents.onRemoteActionError, err);
      }
    }
  }
);

/**
 * Stop remote config
 */
ipcMain.on(ElectronChannels.stopRemoteAction, (event) => {
  Logger.info("Stopped");
  new Notification({ title: "Workers stopped" }).show();
  cancelableRemoteJob?.cancel();
  isRemoteSSHStarted = !cancelableRemoteJob.isCanceled();
  event.reply(RemoteActionEvents.onRemoteActionStatus, isRemoteSSHStarted);
});
