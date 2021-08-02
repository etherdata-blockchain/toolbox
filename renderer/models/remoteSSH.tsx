// @flow
import * as React from "react";
import PouchDB from "pouchdb";
import { ConfigParser, Config, WorkerStatus } from "remote-ssh";
import { SavedConfiguration } from "../component/remote_ssh/interface";
import YAML from "yaml";
import { message } from "antd";
import { database_names } from "../../configurations/database_names";
import { ipcRenderer } from "electron";

interface RemoteSshInterface {
  /**
   * Configuration saved in database. Doesn't contain actual configurations
   */
  savedConfig: SavedConfiguration;
  /**
   * Contains real configurations
   */
  config: Config;
  workingConfig: Config;
  loadSavedConfig(id: string): Promise<SavedConfiguration>;
  updateConfig(content: string): Promise<void>;
  updateWorkingConfig(config: Config): void;
  isRunning: boolean;
  workers: WorkerStatus[];
  env: { [key: string]: string };
  setEnv(env: { [key: string]: string }): void;
}

type Props = {
  children: any;
};

//@ts-ignore
export const RemoteSshContext = React.createContext<RemoteSshInterface>({});

const db = new PouchDB<SavedConfiguration>(database_names.remoteSSH);

export function RemoteSshProvider(props: Props) {
  const { children } = props;
  const [savedConfig, setSavedConfig] = React.useState<SavedConfiguration>();
  const [config, setConfig] = React.useState<Config>();
  const [isRunning, setIsRunning] = React.useState(false);
  const [workers, setWorkers] = React.useState<WorkerStatus[]>([]);
  const [env, setEnv] = React.useState(undefined);
  const [workingConfig, updateWorkingConfig] = React.useState<Config>();

  React.useEffect(() => {
    ipcRenderer.on("error", async (event, reason) => {
      await message.error(reason.toString());
    });

    ipcRenderer.on("status", async (event, newStatus) => {
      setIsRunning(newStatus);
    });

    ipcRenderer.on("update", async (event, newWorkers) => {
      setWorkers(newWorkers);
    });

    ipcRenderer.on("finish", async (event) => {
      setIsRunning(false);
    });
  }, []);

  const loadSavedConfig = React.useCallback(async (id: string) => {
    let doc = await db.get(id);
    setConfig(undefined);
    setSavedConfig(undefined);
    setSavedConfig(doc);
    return doc;
  }, []);

  const updateConfig = React.useCallback(async (content: string) => {
    try {
      message.destroy();
      message.info("Found changes, re-parsing...");
      setConfig(YAML.parse(content));
    } catch (err) {
      await message.error("Configuration file contains error");
    }
  }, []);

  const value: RemoteSshInterface = {
    config,
    savedConfig,
    loadSavedConfig,
    updateConfig,
    isRunning,
    workers,
    env,
    setEnv,
    workingConfig,
    updateWorkingConfig,
  };

  return (
    <RemoteSshContext.Provider value={value}>
      {children}
    </RemoteSshContext.Provider>
  );
}
