// @flow
import * as React from "react";
import { Button, Form, Input, Modal, Tooltip } from "antd";
import { DesktopOutlined } from "@ant-design/icons";
import { JsonRpcContext } from "../../models/jsonRpc";

type Props = {};

export function JsonRPCAction(props: Props) {
  const [showSetRemote, setShowRemote] = React.useState(false);
  const [remoteForm] = Form.useForm();
  const { setData, port, host } = React.useContext(JsonRpcContext);

  const onCancelRemoteDialog = React.useCallback(() => {
    setShowRemote(false);
  }, []);

  const onOkRemoteDialog = React.useCallback(() => {
    let host = remoteForm.getFieldValue("host");
    let port = remoteForm.getFieldValue("port");
    setData(port, host);
    setShowRemote(false);
  }, []);

  return (
    <div style={{ overflowY: "hidden" }}>
      <Tooltip title={"Remotes"}>
        <Button shape={"round"} style={{ marginRight: 10 }}>
          <DesktopOutlined
            onClick={() => {
              remoteForm.setFieldsValue({
                host: host,
                port: port,
              });
              setShowRemote(true);
            }}
          />
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
            name={"host"}
            label={"Remote IP Address"}
            extra={"Remote Address. For example, http://192.168.1.1"}
          >
            <Input.TextArea rows={1} name={"ipAddresses"} />
          </Form.Item>
          <Form.Item
            name={"port"}
            label={"Remote IP port"}
            extra={"Remote port. For example, 8545"}
          >
            <Input.TextArea rows={1} name={"port"} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
