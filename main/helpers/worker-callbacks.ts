import { WorkerStatus } from "remote-ssh";

export function onWorkerError(
  index: number,
  progress: number,
  err: any,
  errorStopped: boolean,
  worker: WorkerStatus
): WorkerStatus {
  worker.errorStopped = errorStopped;
  worker.errors.push({
    index: index,
    progress,
    output: err,
  });

  worker.totalOutputs.push({
    index,
    progress,
    output: err,
  });

  return worker;
}

export function onWorkerCommand(
  index: number,
  progress: number,
  output: any,
  worker: WorkerStatus
): WorkerStatus {
  worker.outputs.push({
    index,
    progress,
    output,
  });

  worker.currentProgress = progress;

  worker.totalOutputs.push({
    index,
    progress,
    output,
  });

  return worker;
}
