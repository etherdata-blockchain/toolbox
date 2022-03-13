import { ipcRenderer } from "electron";
import { ElectronChannels, RemoteActionEvents } from "../../shared/event_names";
import { Result, WorkerStatus } from "@etherdata-blockchain/remote-action";

export class RemoteAction {
  static stop() {
    ipcRenderer.send(ElectronChannels.stopRemoteAction);
  }

  /**
   * Start running remote action
   * @param configFilePath Configuration file path
   * @param envs Environments variables
   */
  static start(configFilePath: string, envs: { [key: string]: string }) {
    ipcRenderer.send(ElectronChannels.startRemoteAction, configFilePath, envs);
  }

  static onFinish(fn: (results: Result[][]) => void) {
    ipcRenderer.on(
      RemoteActionEvents.onRemoteActionFinish,
      async (event, results: Result[][]) => {
        fn(results);
      }
    );
  }

  static onUpdate(fn: (worker: WorkerStatus[]) => void) {
    ipcRenderer.on(
      RemoteActionEvents.onRemoteActionUpdate,
      async (event, status) => {
        fn(status);
      }
    );
  }

  static onStatus(fn: (status: any) => void) {
    ipcRenderer.on(
      RemoteActionEvents.onRemoteActionError,
      async (event, status) => {
        fn(status);
      }
    );
  }

  static onError(fn: (reason: any) => void) {
    ipcRenderer.on(
      RemoteActionEvents.onRemoteActionError,
      async (event, reason) => {
        fn(reason);
      }
    );
  }
}
