// @flow
import * as React from "react";
import { useRouter } from "next/router";
import {
  Col,
  Collapse,
  Descriptions,
  Empty,
  message,
  Row,
  Typography,
} from "antd";
import { RemoteSshContext } from "../../../models/remoteSSH";

const { Title } = Typography;
const { watchFile, readFileSync } = require("fs");

type Props = {};

export default function ConfigDetails(props: Props) {
  const router = useRouter();
  const { loadSavedConfig, config, savedConfig, updateConfig } =
    React.useContext(RemoteSshContext);

  React.useEffect(() => {
    let id: string = router.query.id as string;
    let watcher = undefined;
    loadSavedConfig(id).then(async (doc) => {
      let file = readFileSync(doc.filePath, "utf-8");
      await updateConfig(file);

      watcher = watchFile(doc.filePath, async (cur, prev) => {
        let file = readFileSync(doc.filePath, "utf-8");
        await updateConfig(file);
      });
    });

    return () => {
      watcher?.unref();
    };
  }, [router.pathname]);

  if (config === undefined) {
    return <Empty />;
  }

  return (
    <div>
      <Title level={5}>{savedConfig.name} </Title>
      <Typography>{savedConfig.filePath}</Typography>
      <Descriptions>
        <Descriptions.Item label={"Concurrency"}>
          {config?.concurrency ?? "Undefined"}
        </Descriptions.Item>
      </Descriptions>
      <Row style={{ height: "100%" }} gutter={[10, 0]}>
        <Col span={24}>
          <Collapse
            bordered={false}
            style={{
              background: "#f7f7f7",
              border: "0px",
              borderRadius: "2px",
            }}
          >
            <Collapse.Panel
              style={{
                background: "#f7f7f7",
                border: "0px",
                borderRadius: "2px",
                marginBottom: 10,
              }}
              key={"remotes"}
              header={"Remotes"}
            >
              <Descriptions>
                {config?.remote?.map((r) => (
                  <Descriptions.Item key={r} label={""}>
                    {r}
                  </Descriptions.Item>
                ))}
              </Descriptions>
            </Collapse.Panel>

            {config?.steps?.map((s, i) => (
              <Collapse.Panel
                style={{
                  background: "#f7f7f7",
                  border: "0px",
                  borderRadius: "2px",
                  marginBottom: 10,
                }}
                key={`step-${i}`}
                header={s?.name ?? s?.run ?? "Put Files"}
              >
                <Descriptions>
                  <Descriptions.Item label={"cwd"}>
                    {s.cwd ?? "null"}
                  </Descriptions.Item>
                  <Descriptions.Item label={"env"}>
                    {s.env ?? "null"}
                  </Descriptions.Item>
                  <Descriptions.Item label={"catch_err"}>
                    {s.catch_err?.toString() ?? "false"}
                  </Descriptions.Item>
                  <Descriptions.Item label={"with_root"}>
                    {s.with_root?.toString() ?? "false"}
                  </Descriptions.Item>
                  {s.files && (
                    <Descriptions.Item label={"Files"} span={24}>
                      {s.files?.length &&
                        s.files.map((f) => `${f.local} -> ${f.remote}`)}
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </Collapse.Panel>
            ))}
          </Collapse>
        </Col>
      </Row>
    </div>
  );
}
