// @flow
import * as React from "react";
import { Col, Divider, Input, Row, Select, Typography } from "antd";

type Props = {};

export function WorkerSelections(props: Props) {
  return (
    <div>
      <Row gutter={[10, 10]}>
        <Col span={6}>
          <Select placeholder={"Filter by"} style={{ width: "100%" }}>
            <Select.Option value={"version"}>Version</Select.Option>
            <Select.Option value={"peerCount"}>Peers Count</Select.Option>
            <Select.Option value={"coinbase"}>coinbase</Select.Option>
            <Select.Option value={"isMining"}>Is Mining</Select.Option>
            <Select.Option value={"isSyncing"}>Is Syncing</Select.Option>
          </Select>
        </Col>

        <Col span={6}>
          <Select placeholder={"Condition"} style={{ width: "100%" }}>
            <Select.Option value={"greater"}>Greater than</Select.Option>
            <Select.Option value={"equal"}>Equal</Select.Option>
            <Select.Option value={"less"}>Less than</Select.Option>
          </Select>
        </Col>

        <Col span={12}>
          <Input placeholder={"By Value"} />
        </Col>
      </Row>
    </div>
  );
}
