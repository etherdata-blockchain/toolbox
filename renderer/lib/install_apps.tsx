import React from "react";
import {
  BlockOutlined,
  CodepenOutlined,
  DesktopOutlined,
  HomeOutlined,
  SecurityScanOutlined,
} from "@ant-design/icons";
import { RemoteActions } from "../component/remote_ssh/components/actions";
import { WorkerActions } from "../component/worker_scanner/actions";
import { JsonRPCAction } from "../component/json_rpc/actions";
import { BlockExporterAction } from "../component/block_exporter/actions";

export interface InstalledApp {
  title: string;
  icon: React.ReactElement;
  link: string;
  actions?: React.ReactElement;
  description: string;
}

export const INSTALL_APPS: InstalledApp[] = [
  {
    title: "Home",
    icon: <HomeOutlined />,
    link: "/home",
    description: "Home Page",
  },
  {
    title: "Remote Action",
    icon: <CodepenOutlined />,
    link: "/remote_ssh",
    actions: <RemoteActions />,
    description: "Configure your apps with action.yaml file",
  },
  {
    title: "Worker Checker",
    icon: <SecurityScanOutlined />,
    link: "/worker_checker",
    actions: <WorkerActions />,
    description: "Check your ETD endpoint easily",
  },
  {
    title: "JSON RPC",
    icon: <DesktopOutlined />,
    link: "/json_rpc",
    actions: <JsonRPCAction />,
    description: "Run JSON rpc command from your UI",
  },
  {
    title: "Block Exporter",
    icon: <BlockOutlined />,
    link: "/block_exporter",
    actions: <BlockExporterAction />,
    description: "Export block data to local disk",
  },
];
