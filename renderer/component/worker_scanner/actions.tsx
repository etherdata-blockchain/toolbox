// @flow
import * as React from "react";
import { Button, Form, Input, Modal, Tooltip } from "antd";
import { DesktopOutlined, RadarChartOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";

type Props = {};

export function WorkerActions(props: Props) {
  const [showSetRemote, setShowRemote] = React.useState(false);
  const [remoteForm] = useForm();

  const onCancelRemoteDialog = React.useCallback(() => {
    setShowRemote(false);
  }, []);

  const onOkRemoteDialog = React.useCallback(() => {
    setShowRemote(false);
  }, []);

  return (
    <div>
      <Tooltip title={"Remotes"}>
        <Button shape={"round"} style={{ marginRight: 10 }}>
          <DesktopOutlined onClick={() => setShowRemote(true)} />
        </Button>
      </Tooltip>

      <Tooltip title={"Scan"}>
        <Button shape={"round"}>
          <RadarChartOutlined />
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
          <Form.Item
            label={"Remote IP Address"}
            extra={"Separate by comma. For example, 192.168.1.1,192.168.1.2"}
          >
            <Input.TextArea rows={20} name={"ipAddresses"} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
