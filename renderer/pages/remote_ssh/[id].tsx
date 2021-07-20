// @flow
import * as React from "react";
import { useRouter } from "next/router";
import { Config } from "remote-ssh";
import { Col, Empty, Row } from "antd";
import PouchDB from "pouchdb";
import { database_names } from "../../../configurations/database_names";
import YAML from "yaml";
import AceEditor from "react-ace";

type Props = {};

const db = new PouchDB<Config>(database_names.remoteSSH);
export default function Details(props: Props) {
  const router = useRouter();
  const [config, setConfig] = React.useState<Config>();
  const [value, setValue] = React.useState("");

  React.useEffect(() => {
    let id: string = router.query.id as string;
    db.get(id).then((doc) => {
      setConfig(doc);
    });
  }, []);

  if (config === undefined) {
    return <Empty />;
  }

  return (
    <Row style={{ height: "100%" }}>
      <Col span={12} style={{ height: "100%" }}>
        <AceEditor width={"100%"} height={"100%"} value={value} />
      </Col>
    </Row>
  );
}
