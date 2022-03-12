import { ipcRenderer } from "electron";
import { ElectronChannels, RemoteActionEvents } from "../../shared/event_names";
import { message } from "antd";
import any = jasmine.any;
import { WorkerStatus, Result } from "@etherdata-blockchain/remote-action";

export class RemoteAction {
  static start() {}

  stop() {
    ipcRenderer.send(ElectronChannels.stopRemoteAction);
  }

  onStart() {
    ipcRenderer.send(ElectronChannels.startRemoteAction);
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
