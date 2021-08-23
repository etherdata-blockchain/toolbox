// @flow
import * as React from "react";
import PouchDB from "pouchdb";
import { SavedConfiguration } from "../component/remote_ssh/interface";
import { database_names } from "../../configurations/database_names";
import { ipcRenderer } from "electron";
import { WorkerCondition, WorkerStatus } from "worker-checking";
import { message } from "antd";

interface JsonRpc {
  setData(port: string, host: string): void;
  port: string;
  host: string;
}

type Props = {
  children: any;
};

//@ts-ignore
export const JsonRpcContext = React.createContext<JsonRpc>({});

export function JsonRpcProvider({ children }: Props) {
  const [port, setPort] = React.useState("");
  const [host, setHost] = React.useState("");

  React.useEffect(() => {
    let host = localStorage.getItem("rpc_host");
    let port = localStorage.getItem("rpc_port");

    if (host) {
      setHost(host);
    }

    if (port) {
      setPort(port);
    }
  }, []);

  const setData = React.useCallback(
    (port: string, host: string) => {
      setPort(port);
      setHost(host);
      localStorage.setItem("rpc_host", host);
      localStorage.setItem("rpc_port", port);
    },
    [host, port]
  );

  const value: JsonRpc = {
    port,
    host,
    setData,
  };

  return (
    <JsonRpcContext.Provider value={value}>{children}</JsonRpcContext.Provider>
  );
}
