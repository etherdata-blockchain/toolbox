import React from "react";
import { BlockExporterContext } from "../../models/blockExporter";
import { Card, Progress, Row } from "antd";
import dynamic from "next/dynamic";

const ReactJson =
  typeof window !== "undefined" &&
  dynamic(() => import("react-json-view"), { ssr: false });

function Index() {
  const { current, total, isStarted, currentBlock } =
    React.useContext(BlockExporterContext);

  return (
    <div>
      <Card>
        <Row>
          {current} / {total}
        </Row>
        <Row>
          <Progress
            percent={(current / total) * 100}
            format={(number) => number.toFixed(2)}
          />
        </Row>
      </Card>
      {ReactJson && <ReactJson src={currentBlock} />}
    </div>
  );
}

export default Index;
