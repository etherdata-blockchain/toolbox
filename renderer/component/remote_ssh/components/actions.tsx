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

import PouchDB from "pouchdb";
import { useRouter } from "next/router";
import { RemoteSshContext } from "../../../models/remoteSSH";
import { DBNames } from "../../../lib/configurations";
import { ElectronDialog } from "../../../lib/electron_dialog";
import { RemoteAction } from "../../../lib/remote_action";

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
      RemoteAction.stop();
    } else {
      updateWorkingConfig(config);
      RemoteAction.start(savedConfig.filePath, env);
    }
  }, [savedConfig, isRunning, env, config]);

  const pickFile = React.useCallback(async () => {
    let result = await ElectronDialog.showOpenDialog({
      filters: [{ name: "Yaml", extensions: ["yml", "yaml", "YML", "YAML"] }],
    });
    if (!result.canceled) {
      setFilePath(result.filePaths[0]);
    }
  }, []);

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

  /**
   * On new open new configuration file
   */
  const onCreateNewEntry = React.useCallback(async () => {
    let savedFilePath = filePath;
    let values = form.getFieldsValue();
    if (filePath.length === 0) {
      const result = await ElectronDialog.showSaveDialog({
        filters: [{ extensions: [".yaml"], name: ".yaml" }],
      });
      if (result.canceled) {
        await ElectronDialog.showMessageBox({
          message: "No saved file provided",
          type: "info",
        });
        return;
      }
      savedFilePath = result.filePath;
    }
    let db = new PouchDB(DBNames.remoteSSH);
    let data = {
      ...values,
      filePath: savedFilePath,
    };
    try {
      await db.post(data);
      /// Clear filepath and form field
      form.resetFields();
      setFilePath("");
      setShowAdd(false);
    } catch (err) {
      await ElectronDialog.showMessageBox({
        type: "error",
        message: err.toString(),
      });
    }
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
          onValuesChange={async (_, values) => {
            await onEnvChanged(values.env);
          }}
        >
          <Typography.Title level={4}>Environments</Typography.Title>
          <Form.List name={"env"}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }, index) => (
                  <Space>
                    <Form.Item
                      {...restField}
                      name={[name, "key"]}
                      fieldKey={[key, "key"]}
                    >
                      <Input placeholder={"key"} />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "value"]}
                      fieldKey={[key, "value"]}
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
        onOk={async () => await onCreateNewEntry()}
        onCancel={() => {
          setShowAdd(false);
        }}
      >
        <Form form={form}>
          <Form.Item label={"Configuration Name"} name={"name"} required={true}>
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
