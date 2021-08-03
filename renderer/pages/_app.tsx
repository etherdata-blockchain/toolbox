import { AppProps } from "next/app";
import { RemoteSshProvider } from "../models/remoteSSH";
import {
  CodepenOutlined,
  HomeOutlined,
  SecurityScanOutlined,
} from "@ant-design/icons";
import { PageLayout } from "../component/pageLayout";
import { RemoteActions } from "../component/remote_ssh/components/actions";
import "antd/dist/antd.css";
import "../styles/Global.css";
import path from "path";
import { WorkerActions } from "../component/worker_scanner/actions";
import { WorkerCheckerProvider } from "../models/workerChecker";

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
  ];

  return (
    <WorkerCheckerProvider>
      <RemoteSshProvider>
        <PageLayout menus={menus}>
          <Component {...pageProps} />
        </PageLayout>
      </RemoteSshProvider>
    </WorkerCheckerProvider>
  );
}

export default MyApp;
