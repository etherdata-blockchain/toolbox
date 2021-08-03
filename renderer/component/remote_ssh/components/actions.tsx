// @flow
import * as React from "react";
import {
  Button,
  Form,
  Input,
  Modal,
  Row,
  Space,
  Tooltip,
  Typography,
} from "antd";
import {
  BorderOutlined,
  CaretRightOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  PlusOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { database_names } from "../../../../configurations/database_names";
import PouchDB from "pouchdb";
import { useRouter } from "next/router";
import { RemoteSshContext } from "../../../models/remoteSSH";
import electron, { ipcRenderer } from "electron";
import { useForm } from "antd/lib/form/Form";

type Props = {};

export function RemoteActions(props: Props) {
  const [showAdd, setShowAdd] = React.useState(false);
  const [showSetting, setShowSetting] = React.useState(false);
  const [filePath, setFilePath] = React.useState("");
  const router = useRouter();
  const [form] = Form.useForm();
  const [settingsForm] = Form.useForm();
  const {
    savedConfig,
    isRunning,
    env,
    updateEnv,
    updateWorkingConfig,
    config,
  } = React.useContext(RemoteSshContext);
  const remote = electron.remote || false;

  const initEnvs = env
    ? Object.entries(env).map(([key, value]) => {
        return {
          key,
          value,
        };
      })
    : [];

  React.useEffect(() => {
    console.log("Update");
    settingsForm.setFieldsValue({ env: initEnvs });
  }, [savedConfig]);

  /// Run the action based on the config
  /// Will also update working config
  /// So that even user update configuration after running,
  /// The displayed configuration in Running worker tab will not change
  const run = React.useCallback(() => {
    if (isRunning) {
      ipcRenderer.send("stop");
    } else {
      updateWorkingConfig(config);
      ipcRenderer.send("start", savedConfig.filePath, env);
    }
  }, [savedConfig, isRunning, env, config]);

  const pickFile = React.useCallback(async () => {
    if (remote) {
      let result = await remote.dialog.showOpenDialog({
        filters: [{ name: "Yaml", extensions: ["yml", "yaml", "YML", "YAML"] }],
      });
      if (!result.canceled) {
        setFilePath(result.filePaths[0]);
      }
    }
  }, [remote]);

  const onEnvChanged = React.useCallback(async (values: any[]) => {
    let filteredValues = values
      .map((v) => {
        return { key: v.key, value: v.value };
      })
      .filter((v) => v.key?.length > 0 && v.value?.length > 0);
    let env: { [key: string]: any } = {};
    for (let v of filteredValues) {
      env[v.key] = v.value;
    }
    await updateEnv(env);
  }, []);

  return (
    <Row>
      {router.query.id === undefined && (
        <Button
          icon={<PlusOutlined />}
          shape={"round"}
          onClick={() => setShowAdd(true)}
          style={{ marginRight: 10 }}
        />
      )}
      {router.query.id && (
        <Tooltip title={isRunning ? "Stop" : "Start"}>
          <Button
            icon={isRunning ? <BorderOutlined /> : <CaretRightOutlined />}
            shape={"round"}
            onClick={run}
          />
        </Tooltip>
      )}

      {router.query.id && (
        <Tooltip title={"Settings"}>
          <Button
            icon={<SettingOutlined />}
            shape={"round"}
            style={{ marginLeft: 20 }}
            onClick={() => setShowSetting(true)}
          />
        </Tooltip>
      )}

      <Modal
        title={"Settings"}
        onOk={() => setShowSetting(false)}
        onCancel={() => setShowSetting(false)}
        visible={showSetting}
      >
        <Form
          form={settingsForm}
          name={"env"}
          initialValues={initEnvs}
          onValuesChange={(_, values) => {
            onEnvChanged(values.env);
          }}
        >
          <Typography.Title level={4}>Environments</Typography.Title>
          <Form.List name={"env"}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }, index) => (
                  <Space>
                    <Form.Item
                      {...restField}
                      name={[name, "key"]}
                      fieldKey={[fieldKey, "key"]}
                    >
                      <Input placeholder={"key"} />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "value"]}
                      fieldKey={[fieldKey, "value"]}
                    >
                      <Input placeholder={"value"} />
                    </Form.Item>
                    <Form.Item>
                      <Button shape={"circle"} onClick={() => remove(index)}>
                        <DeleteOutlined />
                      </Button>
                    </Form.Item>
                  </Space>
                ))}

                <Form.Item>
                  <Button type={"dashed"} onClick={add} block>
                    Add ENV
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>

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
            <Button onClick={pickFile}>
              Open File
              {filePath && <CheckCircleOutlined style={{ color: "green" }} />}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Row>
  );
}
