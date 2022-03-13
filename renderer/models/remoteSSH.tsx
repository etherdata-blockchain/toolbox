// @flow
import * as React from "react";
import PouchDB from "pouchdb";
import { Config, WorkerStatus } from "@etherdata-blockchain/remote-action";
import { SavedConfiguration } from "../component/remote_ssh/interface";
import YAML from "yaml";
import { message } from "antd";
import { DBNames } from "../lib/configurations";
import { RemoteAction } from "../lib/remote_action";
import * as fs from "fs";

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
  isRunning: boolean;
  workers: WorkerStatus[];
  env: { [key: string]: string };

  /**
   * Update environments
   * @param env
   */
  updateEnv(env: { [key: string]: string }): void;

  /**
   * Load saved configuration from DB
   * @param id
   */
  loadSavedConfig(id: string): Promise<SavedConfiguration>;

  updateConfig(content: string): Promise<void>;

  /**
   * Update worker's configuration
   * @param config
   */
  updateWorkingConfig(config: Config): void;
}

type Props = {
  children: any;
};

export let db = new PouchDB<SavedConfiguration>(DBNames.remoteSSH);
//@ts-ignore
export const RemoteSshContext = React.createContext<RemoteSshInterface>({});

export function RemoteSshProvider(props: Props) {
  const { children } = props;
  const [savedConfig, setSavedConfig] = React.useState<SavedConfiguration>();
  const [config, setConfig] = React.useState<Config>();
  const [isRunning, setIsRunning] = React.useState(false);
  const [workers, setWorkers] = React.useState<WorkerStatus[]>([]);
  const [env, setEnv] = React.useState(undefined);
  const [workingConfig, updateWorkingConfig] = React.useState<Config>();

  React.useEffect(() => {
    RemoteAction.onError(async (reason) => {
      await message.error(reason.toString());
    });

    RemoteAction.onStatus((status) => {
      setIsRunning(status);
    });

    RemoteAction.onUpdate((workers) => {
      setWorkers(workers);
    });

    RemoteAction.onFinish(() => {
      setIsRunning(false);
    });
  }, []);

  const updateEnv = React.useCallback(
    async (env: { [key: string]: string }) => {
      //@ts-ignore
      let doc = await db.get(savedConfig._id);
      setEnv(env);
      doc.env = env;
      await db.put(doc);
    },
    [env, savedConfig]
  );

  const loadSavedConfig = React.useCallback(async (id: string) => {
    let doc = await db.get(id);
    if (!fs.existsSync(doc.filePath)) {
      message.error("File not found");
      throw new Error("File not found");
    }
    setConfig(undefined);
    setSavedConfig(doc);
    setEnv(doc.env);
    return doc;
  }, []);

  const updateConfig = React.useCallback(async (content: string) => {
    try {
      message.destroy();
      message.info("Found changes, re-parsing...");
      if (content.length === 0) {
        setConfig({
          concurrency: 0,
          logger: undefined,
          login: undefined,
          name: "",
          output: false,
          remote: [],
          start_from: 0,
          steps: [],
        });
        return;
      }
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
    updateEnv,
    workingConfig,
    updateWorkingConfig,
  };

  return (
    <RemoteSshContext.Provider value={value}>
      {children}
    </RemoteSshContext.Provider>
  );
}
