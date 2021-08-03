// @flow
import * as React from "react";
import { Button, Form, Input, Modal, Tooltip } from "antd";
import {
  BorderOutlined,
  DesktopOutlined,
  RadarChartOutlined,
} from "@ant-design/icons";
import { WorkerCheckerContext } from "../../models/workerChecker";

type Props = {};

export function WorkerActions(props: Props) {
  const [showSetRemote, setShowRemote] = React.useState(false);
  const [remoteForm] = Form.useForm();
  const {
    updateSavedRemotes,
    isStarted,
    stop,
    start,
    savedRemotes,
    concurrency,
    condition,
    remotes,
  } = React.useContext(WorkerCheckerContext);

  const onCancelRemoteDialog = React.useCallback(() => {
    setShowRemote(false);
  }, []);

  const onOkRemoteDialog = React.useCallback(() => {
    let data = remoteForm.getFieldValue("addresses");
    let concurrency = remoteForm.getFieldValue("concurrency");
    updateSavedRemotes(data, concurrency);
    setShowRemote(false);
  }, []);

  const onScanBtnClick = React.useCallback(() => {
    if (isStarted) {
      stop();
    } else {
      start();
    }
  }, [isStarted, condition, remotes]);

  return (
    <div style={{ overflowY: "hidden" }}>
      <Tooltip title={"Remotes"}>
        <Button shape={"round"} style={{ marginRight: 10 }}>
          <DesktopOutlined
            onClick={() => {
              remoteForm.setFieldsValue({
                addresses: savedRemotes,
                concurrency: concurrency,
              });
              setShowRemote(true);
            }}
          />
        </Button>
      </Tooltip>

      <Tooltip title={isStarted ? "Stop" : "Scan"}>
        <Button shape={"round"} onClick={onScanBtnClick}>
          {isStarted ? <BorderOutlined /> : <RadarChartOutlined />}
        </Button>
      </Tooltip>

      <Modal
        visible={showSetRemote}
        onCancel={onCancelRemoteDialog}
        onOk={onOkRemoteDialog}
        title={"Set Remote Addresses"}
        width={"80%"}
      >
        <Form form={remoteForm}>
          <Form.Item name={"concurrency"} label={"Concurrency"}>
            <Input type={"number"} />
          </Form.Item>
          <Form.Item
            name={"addresses"}
            label={"Remote IP Address"}
            extra={
              "Separate by comma.Port number is optional . For example, 192.168.1.1:8547,192.168.1.2:8545"
            }
          >
            <Input.TextArea rows={10} name={"ipAddresses"} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
