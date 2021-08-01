// @flow
import * as React from "react";
import { useRouter } from "next/router";
import { Col, Collapse, Descriptions, Empty, Row, Typography } from "antd";
import PouchDB from "pouchdb";
import { database_names } from "../../../configurations/database_names";
import { SavedConfiguration } from "./interface";
import { Config } from "remote-ssh";
import YAML from "yaml";

const { Title } = Typography;
const { watchFile, readFileSync } = require("fs");

type Props = {};

const db = new PouchDB<SavedConfiguration>(database_names.remoteSSH);
export default function Details(props: Props) {
  const router = useRouter();
  const [config, setConfig] = React.useState<SavedConfiguration>();
  const [value, setValue] = React.useState<Config>();

  React.useEffect(() => {
    let id: string = router.query.id as string;
    let watcher = undefined;
    db.get(id).then((doc) => {
      setConfig(doc);
      let file = readFileSync(doc.filePath, "utf-8");
      setValue(YAML.parse(file));

      watcher = watchFile(doc.filePath, (cur, prev) => {
        let file = readFileSync(doc.filePath, "utf-8");

        setValue(YAML.parse(file));
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
      <Title level={5}>{config.name}</Title>
      <Typography>{config.filePath}</Typography>
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
            {value?.steps?.map((s, i) => (
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
                  {s.files && (
                    <Descriptions.Item label={"Files"} span={24}>
                      {s.files.map((f) => `${f.remote} -> ${f.local}`)}
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
