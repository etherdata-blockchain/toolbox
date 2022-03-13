export const ElectronChannels = {
  startRemoteAction: "start-remote",
  stopRemoteAction: "stop-remote",
  startWorkerChecker: "start-worker",
  stopWorkerChecker: "stop-worker",
  startBlockExporter: "start-export",
  stopBlockExporter: "stop-export",
  showSaveDialog: "show-save",
  showOpenDialog: "open-dialog",
  showMessageDialog: "show-message-dialog",
  readFileSync: "read-file",
  writeFileSync: "write-file",
};

export const RemoteActionEvents = {
  /**
   * Any error occurs
   */
  onRemoteActionError: "remote-start",
  /**
   * Remote action is start or stop
   */
  onRemoteActionStatus: "remote-status",
  /**
   * Any new logs coming
   */
  onRemoteActionUpdate: "remote-update",
  /**
   * Action is finished
   */
  onRemoteActionFinish: "remote-finish",
};
