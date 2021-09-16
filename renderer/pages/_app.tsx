import { AppProps } from "next/app";
import { RemoteSshProvider } from "../models/remoteSSH";
import {
  CodepenOutlined,
  HomeOutlined,
  SecurityScanOutlined,
  DesktopOutlined,
  BlockOutlined,
} from "@ant-design/icons";
import { PageLayout } from "../component/pageLayout";
import { RemoteActions } from "../component/remote_ssh/components/actions";
import "antd/dist/antd.css";
import "../styles/Global.css";
import path from "path";
import { WorkerActions } from "../component/worker_scanner/actions";
import { WorkerCheckerProvider } from "../models/workerChecker";
import { JsonRPCAction } from "../component/json_rpc/actions";
import { JsonRpcProvider } from "../models/jsonRpc";
import { BlockExporterAction } from "../component/block_exporter/actions";
import { BlockExporterProvider } from "../models/blockExporter";

function ensureFirstBackSlash(str) {
  return str.length > 0 && str.charAt(0) !== "/" ? "/" + str : str;
}

function uriFromPath(_path) {
  const pathName = path.resolve(_path).replace(/\\/g, "/");
  return encodeURI("file://" + ensureFirstBackSlash(pathName));
}

function MyApp(props: AppProps) {
  const { Component, pageProps } = props;

  const menus = [
    {
      title: "Home",
      icon: <HomeOutlined />,
      link: "/home",
    },
    {
      title: "Remote SSH",
      icon: <CodepenOutlined />,
      link: "/remote_ssh",
      actions: <RemoteActions />,
    },
    {
      title: "Worker Checker",
      icon: <SecurityScanOutlined />,
      link: "/worker_checker",
      actions: <WorkerActions />,
    },
    {
      title: "JSON RPC",
      icon: <DesktopOutlined />,
      link: "/json_rpc",
      actions: <JsonRPCAction />,
    },
    {
      title: "Block Exporter",
      icon: <BlockOutlined />,
      link: "/block_exporter",
      actions: <BlockExporterAction />,
    },
  ];

  return (
    <BlockExporterProvider>
      <WorkerCheckerProvider>
        <RemoteSshProvider>
          <JsonRpcProvider>
            <PageLayout menus={menus}>
              <Component {...pageProps} />
            </PageLayout>
          </JsonRpcProvider>
        </RemoteSshProvider>
      </WorkerCheckerProvider>
    </BlockExporterProvider>
  );
}

export default MyApp;
