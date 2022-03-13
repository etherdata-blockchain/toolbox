// @flow
import * as React from "react";
import { Button, List, message, Typography } from "antd";
import PouchDB from "pouchdb";
import Link from "next/link";
import { SavedConfiguration } from "../../component/remote_ssh/interface";
import { DBNames } from "../../lib/configurations";

const { Title } = Typography;

type Props = {};

const db = new PouchDB<SavedConfiguration>(DBNames.remoteSSH);
export default function Index({}: Props) {
  const [configs, setConfigs] = React.useState<SavedConfiguration[]>([]);
  React.useEffect(() => {
    db.allDocs({ include_docs: true }).then((docs) => {
      setConfigs(docs.rows.map((r) => r.doc));
    });

    db.changes({ since: "now", live: true }).on("change", async (data) => {
      let docs = await db.allDocs({ include_docs: true });
      setConfigs(docs.rows.map((r) => r.doc));
    });
  }, []);

  const deleteDocument = React.useCallback(async (doc: any) => {
    try {
      let confirm = window.confirm("Delete this document?");
      if (confirm) {
        await db.remove(doc);
      }
    } catch (err) {
      message.error(err.toString());
    }
  }, []);

  return (
    <div>
      <Title level={4}>Saved Configurations</Title>
      <List>
        {configs.map((c) => (
          <List.Item
            actions={[
              <Button type={"link"} onClick={() => deleteDocument(c)}>
                Delete
              </Button>,
              //@ts-ignore
              <Link href={"/remote_ssh/" + c._id}>
                <a> Details</a>
              </Link>,
            ]}
            //@ts-ignore
            key={c._id}
          >
            <List.Item.Meta title={c.name} description={`${c.filePath}`} />
          </List.Item>
        ))}
      </List>
    </div>
  );
}
