// @flow
import * as React from "react";
import { WorkerSelections } from "../../component/worker_scanner/selections";
import { Card, Col, Progress, Row, Spin, Typography } from "antd";
import { RemoteList } from "../../component/worker_scanner/RemoteList";
import { WorkerCheckerContext } from "../../models/workerChecker";
import { CheckCircleOutlined } from "@ant-design/icons";

type Props = {};

export default function Index(props: Props) {
  const { progress, remotes, isStarted, isFinished, workers } =
    React.useContext(WorkerCheckerContext);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <WorkerSelections />
      {remotes.length > 0 && (
        <Card
          style={{
            marginTop: 10,
            height: 80,
          }}
        >
          <Row gutter={[10, 10]}>
            <Col span={2}>
              {isStarted && <Spin />}{" "}
              {isFinished && (
                <CheckCircleOutlined style={{ color: "green", fontSize: 25 }} />
              )}
            </Col>
            <Col span={4}>
              <Typography>
                Found {workers.length} / {remotes.length}
              </Typography>
            </Col>
            <Col span={18}>
              <Progress percent={(progress / remotes.length) * 100} />
            </Col>
          </Row>
        </Card>
      )}

      <RemoteList />
    </div>
  );
}
