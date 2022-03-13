// @flow
import * as React from "react";
import { ipcRenderer } from "electron";
import { message } from "antd";

interface BlockExporter {
  host: string;
  output: string;
  current: number;
  total: number;
  concurrency: number;
  isStarted: boolean;
  currentBlock: any;

  setData(host: string, output: string, concurrency: number): void;

  start(): void;

  stop(): void;
}

type Props = {
  children: any;
};

//@ts-ignore
export const BlockExporterContext = React.createContext<BlockExporter>({});

export function BlockExporterProvider({ children }: Props) {
  const [host, setHost] = React.useState("");
  const [current, setCurrent] = React.useState(0);
  const [output, setOutput] = React.useState("");
  const [total, setTotal] = React.useState(0);
  const [isStarted, setIsStarted] = React.useState(false);
  const [currentBlock, setCurrentBlock] = React.useState<any>();
  const [concurrency, setConcurrency] = React.useState(1);

  React.useEffect(() => {
    let host = localStorage.getItem("block_exporter_host");
    let output = localStorage.getItem("block_exporter_output");
    let concurrency = localStorage.getItem("block_exporter_concurrency");

    if (host) {
      setHost(host);
    }

    if (output) {
      setOutput(output);
    }

    if (concurrency) {
      setConcurrency(parseInt(concurrency));
    }

    ipcRenderer.on(
      "block-exporter-update",
      (e, { current, total, blockData }: any) => {
        setCurrent(current);
        setTotal(total);
        setCurrentBlock(blockData);
      }
    );

    ipcRenderer.on("block-exporter-status-changed", (e, started: any) => {
      setIsStarted(started);
    });

    ipcRenderer.on("block-exporter-error", async (e, msg) => {
      await message.error(msg.toString());
    });
  }, []);

  const start = React.useCallback(() => {
    ipcRenderer.send("block_exporter_start", {
      host,
      output,
      concurrency,
    });
  }, [host, output, concurrency]);

  const stop = React.useCallback(() => {
    ipcRenderer.send("block_exporter_stop");
  }, [host, output]);

  const setData = React.useCallback(
    (host: string, output: string, concurrency: number) => {
      setHost(host);
      setOutput(output);
      setConcurrency(concurrency);
      localStorage.setItem("block_exporter_host", host);
      localStorage.setItem("block_exporter_output", output);
      localStorage.setItem(
        "block_exporter_concurrency",
        concurrency.toString()
      );
    },
    [host, concurrency, output]
  );

  const value: BlockExporter = {
    host,
    setData,
    total,
    current,
    output,
    start,
    stop,
    isStarted,
    currentBlock,
    concurrency,
  };

  return (
    <BlockExporterContext.Provider value={value}>
      {children}
    </BlockExporterContext.Provider>
  );
}
