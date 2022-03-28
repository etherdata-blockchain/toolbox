// @flow
import * as React from "react";
import { Tabs } from "antd";
import ConfigDetails from "../../component/remote_ssh/components/ConfigDetails";
import { WorkerDetail } from "../../component/remote_ssh/components/WorkerDetail";
import AutoSizer from "react-virtualized-auto-sizer";
import { RemoteSshContext } from "../../models/remoteSSH";

type Props = {};

export default function Details(props: Props) {
  const { workingConfig, workers } = React.useContext(RemoteSshContext);
  return (
    <Tabs defaultActiveKey={"1"} type={"card"} data-testid="container">
      <Tabs.TabPane tab={"Configurations"} key={"1"}>
        <ConfigDetails />
      </Tabs.TabPane>
      <Tabs.TabPane
        id={"worker"}
        key={"2"}
        tab={"Running workers"}
        style={{ height: "calc(100vh - 130px)" }}
      >
        <WorkerDetail actionConfig={workingConfig} workers={workers} />
      </Tabs.TabPane>
    </Tabs>
  );
}
