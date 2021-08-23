// @flow
import * as React from "react";
import {
  Admin,
  Miner,
  Etd,
  Clique,
  Debug,
  Json_rpc,
  Json_rpc_methods,
  Personal,
  Real_time,
  Txpool,
} from "etd-react-ui";
import { Tabs } from "antd";
import { JsonRpcContext } from "../../models/jsonRpc";

type Props = {};

export default function Index({}: Props) {
  const { host, port } = React.useContext(JsonRpcContext);

  const methods = [
    {
      name: "Admin",
      component: <Admin host={host} port={port} />,
    },
    {
      name: "Miner",
      component: <Miner host={host} port={port} />,
    },
    {
      name: "ETD",
      component: <Etd host={host} port={port} />,
    },
    {
      name: "Clique",
      component: <Clique host={host} port={port} />,
    },
    {
      name: "Debug",
      component: <Debug host={host} port={port} />,
    },
    {
      name: "Json_rpc",
      component: <Json_rpc host={host} port={port} />,
    },
    {
      name: "Json_rpc_methods",
      component: <Json_rpc_methods host={host} port={port} />,
    },
    {
      name: "Personal",
      component: <Personal host={host} port={port} />,
    },
    {
      name: "Real Time",
      component: <Real_time host={host} port={port} />,
    },
    {
      name: "Txpool",
      component: <Txpool host={host} port={port} />,
    },
  ];

  return (
    <Tabs>
      {methods.map((m, i) => (
        <Tabs.TabPane tab={m.name} key={`${i}`} className={"rpcTab"}>
          {m.component}
        </Tabs.TabPane>
      ))}
    </Tabs>
  );
}
