import { AppProps } from "next/app";
import { RemoteSshProvider } from "../models/remoteSSH";
import { PageLayout } from "../component/pageLayout";
import path from "path";
import { WorkerCheckerProvider } from "../models/workerChecker";
import { JsonRpcProvider } from "../models/jsonRpc";
import { BlockExporterProvider } from "../models/blockExporter";
import { INSTALL_APPS } from "../lib/install_apps";

import "antd/dist/antd.css";
import "../styles/Global.css";

function ensureFirstBackSlash(str) {
  return str.length > 0 && str.charAt(0) !== "/" ? "/" + str : str;
}

function uriFromPath(_path) {
  const pathName = path.resolve(_path).replace(/\\/g, "/");
  return encodeURI("file://" + ensureFirstBackSlash(pathName));
}

function MyApp(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <BlockExporterProvider>
      <WorkerCheckerProvider>
        <RemoteSshProvider>
          <JsonRpcProvider>
            <PageLayout menus={INSTALL_APPS}>
              <Component {...pageProps} />
            </PageLayout>
          </JsonRpcProvider>
        </RemoteSshProvider>
      </WorkerCheckerProvider>
    </BlockExporterProvider>
  );
}

export default MyApp;
