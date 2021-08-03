// @flow
import * as React from "react";
import { WorkerSelections } from "../../component/worker_scanner/selections";
import { Card, Col, Progress, Row, Spin, Typography } from "antd";
import { RemoteList } from "../../component/worker_scanner/RemoteList";

type Props = {};

export default function Index(props: Props) {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", maxHeight: "100%" }}
    >
      <WorkerSelections />

      <Card
        style={{
          marginTop: 10,
        }}
      >
        <Row gutter={[10, 10]}>
          <Col span={2}>
            <Spin />
          </Col>
          <Col span={4}>
            <Typography> Found 1 / 122</Typography>
          </Col>
          <Col span={18}>
            <Progress />
          </Col>
        </Row>
      </Card>

      <RemoteList />
    </div>
  );
}
