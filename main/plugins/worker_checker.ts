import { ipcMain, Notification } from "electron";
import {
  Web3PluginAcceptType,
  Worker,
  WorkerChecker,
  WorkerCondition,
} from "@etherdata-blockchain/worker-checker";
import { WorkerStatus as WorkerCheckingStatus } from "@etherdata-blockchain/worker-checker/dist/interfaces";
import { getPluginsByName } from "../helpers/worker-checking-utils";
import { CancelablePromise } from "cancelable-promise";
import { ElectronChannels } from "../../shared/event_names";

// Indicate whether worker checker is running
let isWorkerCheckerStarted = false;
let cancelableWorkerCheckingJob: CancelablePromise<any> | undefined;

/**
 * Start worker checking
 */
ipcMain.on(
  ElectronChannels.startWorkerChecker,
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

ipcMain.on(ElectronChannels.stopWorkerChecker, (event) => {
  cancelableWorkerCheckingJob?.cancel();
  isWorkerCheckerStarted = false;
  event.reply("checker-start-status", isWorkerCheckerStarted);
});
