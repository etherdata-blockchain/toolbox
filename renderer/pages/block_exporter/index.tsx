import React from "react";
import { BlockExporterContext } from "../../models/blockExporter";
import { Card, Col, Progress, Row } from "antd";
import ReactJson from "react-json-view";

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
      <ReactJson src={currentBlock} />
    </div>
  );
}

export default Index;
