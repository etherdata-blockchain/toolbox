// @flow
import * as React from "react";
import { Button, Form, Input, Modal, Row } from "antd";
import { CaretRightOutlined, PlusOutlined } from "@ant-design/icons";
import { Config } from "remote-ssh";
import { database_names } from "../../../../configurations/database_names";
import PouchDB from "pouchdb";
import { useRouter } from "next/router";

type Props = {};

export function RemoteActions(props: Props) {
  const [showAdd, setShowAdd] = React.useState(false);
  const [filePath, setFilePath] = React.useState("");
  const router = useRouter();
  const [form] = Form.useForm();

  return (
    <Row>
      <Button
        icon={<PlusOutlined />}
        shape={"round"}
        onClick={() => setShowAdd(true)}
        style={{ marginRight: 10 }}
      />
      {router.query.id && (
        <Button icon={<CaretRightOutlined />} shape={"round"} />
      )}

      <Modal
        title={"Add New Config"}
        visible={showAdd}
        onOk={async () => {
          let values = form.getFieldsValue();
          if (filePath.length === 0) {
            const { dialog } = require("electron").remote;
            await dialog.showMessageBox({
              message: "You need to set your configuration file",
              type: "error",
            });
          }
          let db = new PouchDB(database_names.remoteSSH);
          let data = {
            ...values,
            filePath: filePath,
          };
          try {
            await db.post(data);
            /// Clear filepath and form field
            form.resetFields();
            setFilePath("");
            setShowAdd(false);
          } catch (err) {
            const { dialog } = require("electron").remote;
            await dialog.showMessageBox({
              type: "error",
              message: err.toString(),
            });
          }
        }}
        onCancel={() => {
          setShowAdd(false);
        }}
      >
        <Form form={form}>
          <Form.Item label={"Configuration Name"} name={"name"}>
            <Input />
          </Form.Item>
          <Form.Item label={"File Path"} name={"filePath"}>
            <Button
              onClick={async () => {
                const { dialog } = require("electron").remote;
                let result = await dialog.showOpenDialog({
                  filters: [{ name: "Yaml", extensions: ["yml", "yaml"] }],
                });
                if (!result.canceled) {
                  setFilePath(result.filePaths[0]);
                }
              }}
            >
              Open File
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Row>
  );
}
