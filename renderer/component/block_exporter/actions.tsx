// @flow
import * as React from "react";
import { Button, Form, Input, message, Modal, Tooltip } from "antd";
import {
  BorderOutlined,
  CaretRightOutlined,
  DesktopOutlined,
  RadarChartOutlined,
} from "@ant-design/icons";
import { WorkerCheckerContext } from "../../models/workerChecker";
import { BlockExporterContext } from "../../models/blockExporter";

type Props = {};

export function BlockExporterAction(props: Props) {
  const [showSetRemote, setShowRemote] = React.useState(false);
  const [savedPath, setSavedPath] = React.useState<string>();

  const [remoteForm] = Form.useForm();
  const { isStarted, host, port, output, start, stop, setData, concurrency } =
    React.useContext(BlockExporterContext);

  const onCancelRemoteDialog = React.useCallback(() => {
    setShowRemote(false);
  }, []);

  const onOkRemoteDialog = React.useCallback(async () => {
    let host = remoteForm.getFieldValue("host");
    let port = remoteForm.getFieldValue("port");
    let concurrency = remoteForm.getFieldValue("concurrency");

    if (!savedPath) {
      await message.error("You need to set saved path first");
      return;
    }
    setShowRemote(false);
    setData(port, host, savedPath, parseInt(concurrency));
  }, [savedPath]);

  const onScanBtnClick = React.useCallback(() => {
    if (isStarted) {
      stop();
    } else {
      start();
    }
  }, [isStarted, host, port, output, concurrency]);

  return (
    <div style={{ overflowY: "hidden" }}>
      <Tooltip title={"Remotes"}>
        <Button shape={"round"} style={{ marginRight: 10 }}>
          <DesktopOutlined
            onClick={() => {
              setSavedPath(output);
              remoteForm.setFieldsValue({
                host: host,
                port: port,
                output: output,
                concurrency: concurrency,
              });
              setShowRemote(true);
            }}
          />
        </Button>
      </Tooltip>

      <Tooltip title={isStarted ? "Stop" : "Scan"}>
        <Button shape={"round"} onClick={onScanBtnClick}>
          {isStarted ? <BorderOutlined /> : <CaretRightOutlined />}
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
          <Form.Item name={"host"} label={"Host"}>
            <Input />
          </Form.Item>
          <Form.Item name={"port"} label={"Port"}>
            <Input />
          </Form.Item>
          <Form.Item name={"concurrency"} label={"Concurrency"}>
            <Input type={"number"} />
          </Form.Item>
          <Form.Item name={"output"} label={"Output"}>
            <Button
              onClick={async () => {
                const { dialog } = require("electron").remote;
                let result = await dialog.showSaveDialog({});
                if (!result.canceled) {
                  setSavedPath(result.filePath);
                }
              }}
            >
              {savedPath ?? " Pick Save path"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
