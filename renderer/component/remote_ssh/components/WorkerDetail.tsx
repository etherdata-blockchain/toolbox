// @flow
import * as React from "react";
import {
  Card,
  Col,
  Collapse,
  Empty,
  Row,
  Spin,
  Steps,
  Tooltip,
  Typography,
} from "antd";
import { WorkerStatus } from "remote-ssh/lib/config";
import { RemoteSshContext } from "../../../models/remoteSSH";
import { Status } from "rc-steps/lib/interface";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
  SmallDashOutlined,
} from "@ant-design/icons";

type Props = {};

export function WorkerDetail(props: Props) {
  const { workingConfig, workers } = React.useContext(RemoteSshContext);

  /**
   * Get connection status.
   * Will render error icon, progress bar or nothing based on the worker connection status
   */
  const getConnectionStatus = React.useCallback(
    (worker: WorkerStatus): JSX.Element | undefined => {
      if (worker.currentProgress === -1) {
        if (worker.errorStopped) {
          return (
            <Tooltip title={worker.errors[0].output}>
              <ExclamationCircleOutlined style={{ color: "red" }} />
            </Tooltip>
          );
        } else {
          return <Spin />;
        }
      }

      return undefined;
    },
    []
  );

  const getStatus = React.useCallback(
    (w: WorkerStatus, index: number): JSX.Element => {
      let error = w.errors.find((e) => e.progress === index);
      if (error) {
        return <ExclamationCircleOutlined style={{ color: "red" }} />;
      }

      if (w.currentProgress > index) {
        return <CheckCircleOutlined style={{ color: "green" }} />;
      }

      if (w.currentProgress === index) {
        return <Spin indicator={<LoadingOutlined spin />} />;
      }

      return <SmallDashOutlined />;
    },
    []
  );

  return (
    <div>
      {workers.length === 0 && <Empty description={"No worker"} />}
      <Row gutter={[10, 20]}>
        {workers.map((w, i) => (
          <Col key={i} span={24}>
            <Card
              title={`Remote: ${w.remoteIP}`}
              // Show extra action based on the connection state
              extra={getConnectionStatus(w)}
            >
              <Collapse
                bordered={false}
                style={{
                  background: "#f7f7f7",
                  border: "0px",
                  borderRadius: "2px",
                }}
              >
                {workingConfig?.steps?.map((s, si) => {
                  let status = getStatus(w, si);
                  let outputs = w.totalOutputs.filter((o) => o.progress === si);

                  return (
                    <Collapse.Panel
                      extra={status}
                      key={`${si}`}
                      header={s.name ?? s.run ?? "Put files"}
                      style={{
                        background: "#f7f7f7",
                        border: "0px",
                        borderRadius: "2px",
                      }}
                    >
                      <div
                        style={{
                          background: "black",
                          maxHeight: 500,
                          overflowY: "scroll",
                          scrollbarColor: "white",
                        }}
                      >
                        {outputs.map((o, oi) => (
                          <Typography
                            key={`${i}-${si}-${oi}`}
                            style={{ color: "white" }}
                          >
                            {o.output.toString()}
                          </Typography>
                        ))}
                      </div>
                    </Collapse.Panel>
                  );
                })}
              </Collapse>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
