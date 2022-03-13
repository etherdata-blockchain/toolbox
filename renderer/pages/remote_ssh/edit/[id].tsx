// @flow
import * as React from "react";
import { useRouter } from "next/router";
import { RemoteSshContext } from "../../../models/remoteSSH";
import { message, Tooltip } from "antd";
import { readFileSync, writeFileSync } from "fs";
import { schema } from "@etherdata-blockchain/remote-action";
import Form from "@rjsf/chakra-ui";
import { JSONSchema7 } from "json-schema";
import YAML from "yaml";
import { LeftOutlined } from "@ant-design/icons";
import { ArrayField } from "../../../component/arrayfield";

type Props = {};

/**
 * Edit the configuration file in GUI
 * @param props
 * @constructor
 */
function Index(props: Props) {
  const router = useRouter();
  const { loadSavedConfig, config, savedConfig, updateConfig } =
    React.useContext(RemoteSshContext);
  const [outputPath, setOutputPath] = React.useState<string>();

  React.useEffect(() => {
    let id: string = router.query.id as string;
    loadSavedConfig(id).then(async (doc) => {
      setOutputPath(doc.filePath);
      let file = readFileSync(doc.filePath, "utf-8");
      await updateConfig(file);
    });
  }, [router.pathname]);

  const jsonSchema = React.useMemo<JSONSchema7>(
    () => ({
      title: "Create a config file",
      definitions: schema.config.definitions as any,
      properties: schema.config.definitions.Config.properties as any,
    }),
    []
  );

  const onSave = React.useCallback(
    async (data: any) => {
      if (outputPath) {
        writeFileSync(outputPath, YAML.stringify(data.formData));
        message.info("Configuration saved");
        await router.push(`/remote_ssh/${router.query.id}`);
      }
    },
    [outputPath]
  );

  if (config === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Tooltip title={"Back"}>
        <LeftOutlined
          style={{ fontSize: 30 }}
          onClick={async () =>
            await router.push(`/remote_ssh/${router.query.id}`)
          }
        />
      </Tooltip>
      <Form
        schema={jsonSchema}
        formData={config}
        onSubmit={async (data) => await onSave(data)}
        ArrayFieldTemplate={ArrayField}
      />
    </div>
  );
}

export default Index;
