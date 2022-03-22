// @flow
import * as React from "react";
import { Card, Collapse, Empty, Spin, Tooltip, Typography } from "antd";

import AutoSizer from "react-virtualized-auto-sizer";
import { VariableSizeList, VariableSizeList as List } from "react-window";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
  SmallDashOutlined,
} from "@ant-design/icons";
import { Config, WorkerStatus } from "@etherdata-blockchain/remote-action";

const defaultStepHeight = 50;
const defaultBaseHeight = 120;
const defaultSpacing = 20;

type Props = {
  /**
   * List of worker
   */
  workers: WorkerStatus[];
  /**
   * Configuration for the remote action
   */
  actionConfig: Config;
};

/**
 * Show list of workers
 * @param workers
 * @param actionConfig
 * @constructor
 */
export function WorkerDetail({ workers, actionConfig }: Props) {
  const baseHeight = React.useMemo(
    () =>
      (actionConfig?.steps?.length ?? 0) * defaultStepHeight +
      defaultBaseHeight,
    [workers]
  );
  const [sizes, setSizes] = React.useState<number[]>(
    Array(workers?.length ?? 0).fill(baseHeight)
  );
  const ref = React.useRef<VariableSizeList>();

  const setSize = React.useCallback(
    (newHeight, index) => {
      sizes[index] = baseHeight + newHeight;
      setSizes(sizes);
      //force reset index
      ref.current?.resetAfterIndex(0, true);
    },
    [sizes]
  );

  return (
    <div style={{ height: "100%" }} data-testid="container">
      {workers.length === 0 && <Empty description={"No worker"} />}
      {workers.length > 0 && (
        <AutoSizer>
          {({ height, width }) => {
            return (
              <List
                height={height}
                ref={ref}
                width={width}
                itemSize={(index) => {
                  if (index > sizes.length - 1) {
                    return baseHeight;
                  }
                  return sizes[index];
                }}
                itemCount={workers.length}
              >
                {({ index, style }) => (
                  <div style={{ ...style, margin: 10 }}>
                    <WorkerDetailCard
                      config={actionConfig}
                      workerStatus={workers[index]}
                      index={index}
                      setSize={setSize}
                    />
                  </div>
                )}
              </List>
            );
          }}
        </AutoSizer>
      )}
    </div>
  );
}

type DetailProps = {
  /**
   * Action config
   */
  config: Config;
  /**
   * Action status
   */
  workerStatus: WorkerStatus;
  /**
   * Worker's index
   */
  index: number;
  /**
   * Update the card's height
   * @param newHeight
   * @param index
   */
  setSize: (newHeight: number, index: number) => void;
};

/**
 * Card component for worker
 * @param config
 * @param workerStatus
 * @param index
 * @param setSize
 * @constructor
 */
function WorkerDetailCard({
  config,
  workerStatus,
  index,
  setSize,
}: DetailProps) {
  const [keys, setKeys] = React.useState<number[]>([]);
  const [heights, setHeights] = React.useState<number[]>(
    Array(config.steps.length).fill(0)
  );

  const updateSize = React.useCallback((keys: number[], heights: number[]) => {
    const totalHeights = heights
      .filter((h, i) => keys.includes(i))
      .reduce((prev, cur) => prev + cur + defaultSpacing, 0);
    setSize(totalHeights, index);
  }, []);

  /**
   * Get connection status.
   * Will render error icon, progress bar or nothing based on the worker connection status
   */
  const getConnectionStatus = React.useCallback(
    (worker: WorkerStatus): JSX.Element | undefined => {
      if (worker.currentProgress === -1) {
        if (worker.errorStopped) {
          return (
            <Tooltip title={worker.errors[0].output}>
              <ExclamationCircleOutlined style={{ color: "red" }} />
            </Tooltip>
          );
        } else {
          return <Spin />;
        }
      }

      return undefined;
    },
    []
  );

  const getStatus = React.useCallback(
    (w: WorkerStatus, index: number): JSX.Element => {
      let error = w.errors.find((e) => e.progress === index);
      if (error) {
        return <ExclamationCircleOutlined style={{ color: "red" }} />;
      }

      if (w.currentProgress > index) {
        return <CheckCircleOutlined style={{ color: "green" }} />;
      }

      if (w.currentProgress === index) {
        return <Spin indicator={<LoadingOutlined spin />} />;
      }

      return <SmallDashOutlined />;
    },
    []
  );

  return (
    <Card
      title={`Remote: ${workerStatus.remoteIP}`}
      // Show extra action based on the connection state
      extra={getConnectionStatus(workerStatus)}
    >
      <Collapse
        bordered={false}
        style={{
          background: "#f7f7f7",
          border: "0px",
          borderRadius: "2px",
        }}
        onChange={async (keys) => {
          const keyInNumbers = (keys as string[]).map((k) => parseInt(k));
          setKeys(keyInNumbers);
          updateSize(keyInNumbers, heights);
        }}
      >
        {config?.steps?.map((s, si) => {
          let status = getStatus(workerStatus, si);
          let outputs = workerStatus.totalOutputs.filter(
            (o) => o.progress === si
          );

          return (
            <Collapse.Panel
              extra={status}
              key={`${si}`}
              header={s.name ?? s.run ?? "Put files"}
              style={{
                background: "#f7f7f7",
                border: "0px",
                borderRadius: "2px",
              }}
            >
              <CommandOutputDisplay
                index={si}
                outputs={outputs}
                onHeight={(height, clickedIndex) => {
                  if (heights[clickedIndex] !== height) {
                    heights[clickedIndex] = height;
                    updateSize(keys, heights);
                    setHeights(heights);
                  }
                }}
              />
            </Collapse.Panel>
          );
        })}
      </Collapse>
    </Card>
  );
}

interface CommandOutputProps {
  /**
   * Step index
   */
  index: number;
  /**
   * Command output
   */
  outputs: any[];
  /**
   * Callback function when height of this component changed
   * @param height
   * @param index
   */
  onHeight: (height: number, index: number) => void;
}

/**
 * Show output from command
 * @param outputs
 * @param onHeight
 * @param index
 * @constructor
 */
function CommandOutputDisplay({
  outputs,
  onHeight,
  index,
}: CommandOutputProps) {
  const ref = React.useRef<HTMLDivElement>();

  React.useEffect(() => {
    onHeight(ref.current.clientHeight, index);
  }, [ref]);

  return (
    <div
      ref={ref}
      style={{
        background: "black",
        maxHeight: 500,
        overflowY: "scroll",
        scrollbarColor: "white",
      }}
    >
      <Typography style={{ color: "white", whiteSpace: "pre-wrap" }}>
        {outputs.map((out) => out.output).join("\n")}
      </Typography>
    </div>
  );
}
