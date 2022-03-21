// @flow
import * as React from "react";
import PouchDB from "pouchdb";
import { SavedConfiguration } from "../component/remote_ssh/interface";
import { ipcRenderer } from "electron";
import {
  WorkerCondition,
  WorkerStatus,
} from "@etherdata-blockchain/worker-checker";
import { message } from "antd";
import { DBNames } from "../lib/configurations";

interface WorkerChecker {
  progress: number;
  isStarted: boolean;
  savedRemotes: string;
  remotes: string[];
  workers: WorkerStatus[];
  isFinished: boolean;
  condition: WorkerCondition<any>;
  concurrency: number;

  setConcurrency(v: number): void;

  start(): void;

  stop(): void;

  updateSavedRemotes(r: string, c: string): void;

  setCondition(c: WorkerCondition<any>): void;
}

type Props = {
  children: any;
};

//@ts-ignore
export const WorkerCheckerContext = React.createContext<WorkerChecker>({});

const db = new PouchDB<SavedConfiguration>(DBNames.remoteSSH);

export function WorkerCheckerProvider({ children }: Props) {
  const [remotes, setRemotes] = React.useState<string[]>([]);
  const [workers, setWorkers] = React.useState<WorkerStatus[]>([]);
  const [isStarted, setIsStarted] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [isFinished, setIsFinished] = React.useState(false);
  const [savedRemotes, setSavedRemotes] = React.useState("");
  const [concurrency, setConcurrency] = React.useState(2);
  const [condition, setCondition] = React.useState<WorkerCondition<any>>({
    workingType: "coinbase",
    value: "",
    comparison: "equal",
  });

  React.useEffect(() => {
    let savedRemotes = localStorage.getItem("worker-checker-remotes");
    let savedConcurrency = localStorage.getItem("worker-checker-concurrency");

    if (savedConcurrency) {
      setConcurrency(parseInt(savedConcurrency));
    }

    if (savedRemotes) {
      let remotes = savedRemotes.split(",");
      setRemotes(remotes);
      setSavedRemotes(savedRemotes);
    }

    ipcRenderer.on("checker-start-status", (event, isStarted: boolean) => {
      console.log("checker-start-status", isStarted);
      setIsStarted(isStarted);
    });

    ipcRenderer.on(
      "checker-status",
      (
        event,
        foundWorkers: WorkerStatus[],
        progress: number,
        isFinished: boolean
      ) => {
        setProgress(progress);
        setWorkers(foundWorkers);
        setIsFinished(isFinished);
      }
    );
  }, []);

  const start = React.useCallback(async () => {
    console.log(condition, remotes);

    if (
      condition.value === undefined ||
      condition.comparison === undefined ||
      condition.workingType === undefined
    ) {
      await message.error("Please set your condition properly");
      return;
    }

    if (remotes.length === 0) {
      await message.error("Your remote list should not be empty");
    }

    ipcRenderer.send(
      "start-worker-checking",
      remotes,
      ["web3"],
      condition,
      concurrency
    );
  }, [condition, remotes]);

  const stop = React.useCallback(() => {
    ipcRenderer.send("stop-worker-checking");
  }, []);

  const updateSavedRemotes = React.useCallback((s: string, c: string) => {
    localStorage.setItem("worker-checker-remotes", s);
    setRemotes(s.split(","));
    localStorage.setItem("worker-checker-concurrency", c);
    setConcurrency(parseInt(c));
    setSavedRemotes(s);
    setProgress(0);
  }, []);

  const value: WorkerChecker = {
    remotes,
    workers,
    isStarted,
    start,
    stop,
    isFinished,
    progress,
    savedRemotes,
    updateSavedRemotes,
    condition,
    setCondition,
    concurrency,
    setConcurrency,
  };

  return (
    <WorkerCheckerContext.Provider value={value}>
      {children}
    </WorkerCheckerContext.Provider>
  );
}
