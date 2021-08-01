// @flow
import * as React from "react";
import PouchDB from "pouchdb";
import { ConfigParser, Config, WorkerStatus } from "remote-ssh";
import { SavedConfiguration } from "../pages/remote_ssh/interface";
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
  loadSavedConfig(id: string): Promise<SavedConfiguration>;
  updateConfig(content: string): Promise<void>;
  isRunning: boolean;
  workers: WorkerStatus[];
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
    setSavedConfig(doc);
    setWorkers([]);
    return doc;
  }, []);

  const updateConfig = React.useCallback(async (content: string) => {
    try {
      message.info("Found changes, re-parsing...");
      setConfig(YAML.parse(content));
      setWorkers([]);
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
  };

  return (
    <RemoteSshContext.Provider value={value}>
      {children}
    </RemoteSshContext.Provider>
  );
}
