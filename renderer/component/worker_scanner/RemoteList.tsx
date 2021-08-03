// @flow
import * as React from "react";
import { List, Typography } from "antd";
import { DesktopOutlined } from "@ant-design/icons";
import { WorkerCheckerContext } from "../../models/workerChecker";

type Props = {};

export function RemoteList(props: Props) {
  const { workers } = React.useContext(WorkerCheckerContext);

  return (
    <List
      style={{ flex: 1, maxHeight: "100%", overflowY: "scroll" }}
      dataSource={workers.filter((w) => !w.success)}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            avatar={
              <DesktopOutlined style={{ fontSize: 40, color: "#42a4f5" }} />
            }
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
