// @flow
import * as React from "react";
import { Col, Divider, Input, Row, Select, Typography } from "antd";
import { Web3PluginAcceptType } from "worker-checking";
import { Comparison } from "worker-checking/dist/interfaces";
import { WorkerCheckerContext } from "../../models/workerChecker";

type Props = {};

export function WorkerSelections(props: Props) {
  const web3PluginTypes: Web3PluginAcceptType[] = [
    "coinbase",
    "blockNumber",
    "isMining",
    "isSyncing",
    "nodeVersion",
    "peerCount",
    "chainID",
  ];

  const comparison: Comparison[] = ["greater", "less", "equal"];
  const { condition, setCondition } = React.useContext(WorkerCheckerContext);

  return (
    <div>
      <Row gutter={[10, 10]}>
        <Col span={6}>
          <Select
            value={condition.workingType}
            placeholder={"Filter by"}
            style={{ width: "100%" }}
            onSelect={(v) => {
              condition.workingType = v;
              setCondition(JSON.parse(JSON.stringify(condition)));
            }}
          >
            {web3PluginTypes.map((v) => (
              <Select.Option value={v} key={v}>
                {v}
              </Select.Option>
            ))}
          </Select>
        </Col>

        <Col span={6}>
          <Select
            value={condition.comparison}
            placeholder={"Comparison"}
            style={{ width: "100%" }}
            onSelect={(v: Comparison) => {
              condition.comparison = v;
              setCondition(JSON.parse(JSON.stringify(condition)));
            }}
          >
            {comparison.map((v) => (
              <Select.Option value={v} key={v}>
                {v}
              </Select.Option>
            ))}
          </Select>
        </Col>

        <Col span={12}>
          <Input
            disabled={
              condition.workingType === "isMining" ||
              condition.workingType === "isSyncing"
            }
            placeholder={"By Value"}
            value={condition.value}
            onChange={(e) => {
              condition.value = e.target.value;
              setCondition(JSON.parse(JSON.stringify(condition)));
            }}
          />
        </Col>
      </Row>
    </div>
  );
}
