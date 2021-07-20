// @flow
import * as React from "react";
import { Button, Form, Input, Modal, Row } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Config } from "remote-ssh";
import { database_names } from "../../../../configurations/database_names";
import { dialog } from "electron";
import PouchDB from "pouchdb";

type Props = {};

export function RemoteActions(props: Props) {
  const [showAdd, setShowAdd] = React.useState(false);
  const [form] = Form.useForm();

  return (
    <Row>
      <Button
        icon={<PlusOutlined />}
        shape={"round"}
        onClick={() => setShowAdd(true)}
      />
      <Modal
        title={"Add New Config"}
        visible={showAdd}
        onOk={async () => {
          let values: { name: string; concurrency: number } =
            form.getFieldsValue();
          let doc: Config = {
            login: undefined,
            output: false,
            remote: [],
            steps: [],
            ...values,
          };

          let db = new PouchDB(database_names.remoteSSH);
          try {
            await db.post(doc);
            form.resetFields();
            setShowAdd(false);
          } catch (err) {
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
          <Form.Item label={"Concurrency"} name={"concurrency"}>
            <Input type={"number"} />
          </Form.Item>
        </Form>
      </Modal>
    </Row>
  );
}
