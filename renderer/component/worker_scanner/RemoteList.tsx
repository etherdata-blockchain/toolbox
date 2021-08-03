// @flow
import * as React from "react";
import { List, Typography } from "antd";
import { WorkerScannerStatus } from "../../models/workerScanner";
import { DesktopOutlined } from "@ant-design/icons";

type Props = {};

export const list: WorkerScannerStatus[] = [
  {
    remote: "192.168.1.1",
    found: true,
    message: "false",
    title: "Is Mining",
  },

  {
    remote: "192.168.1.1",
    found: true,
    message: "false",
    title: "Is Mining",
  },
  {
    remote: "192.168.1.1",
    found: true,
    message: "false",
    title: "Is Mining",
  },
  {
    remote: "192.168.1.1",
    found: true,
    message: "false",
    title: "Is Mining",
  },
  {
    remote: "192.168.1.1",
    found: true,
    message: "false",
    title: "Is Mining",
  },
  {
    remote: "192.168.1.1",
    found: true,
    message: "false",
    title: "Is Mining",
  },
  {
    remote: "192.168.1.1",
    found: true,
    message: "false",
    title: "Is Mining",
  },
  {
    remote: "192.168.1.1",
    found: true,
    message: "false",
    title: "Is Mining",
  },
];

export function RemoteList(props: Props) {
  return (
    <List
      style={{ flex: 1, maxHeight: "100%", overflowY: "scroll" }}
      dataSource={list}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            avatar={<DesktopOutlined style={{ fontSize: 40 }} />}
            title={item.remote}
            description={
              <Typography>
                {item.title}: {item.message}
              </Typography>
            }
          />
        </List.Item>
      )}
    />
  );
}
