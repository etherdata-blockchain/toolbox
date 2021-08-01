// @flow
import * as React from "react";
import { Tabs } from "antd";
import ConfigDetails from "./components/ConfigDetails";
import { WorkerDetail } from "./components/WorkerDetail";

type Props = {};

export default function Details(props: Props) {
  return (
    <Tabs defaultActiveKey={"1"} type={"card"}>
      <Tabs.TabPane tab={"Configurations"} key={"1"}>
        <ConfigDetails />
      </Tabs.TabPane>
      <Tabs.TabPane key={"2"} tab={"Running workers"}>
        <WorkerDetail />
      </Tabs.TabPane>
    </Tabs>
  );
}
