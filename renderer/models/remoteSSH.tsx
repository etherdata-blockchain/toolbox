// @flow
import * as React from "react";
import PouchDB from "pouchdb";
import { ConfigParser, Config } from "remote-ssh";

interface RemoteSshInterface {}

type Props = {
  children: any;
};

//@ts-ignore
export const RemoteSshContext = React.createContext<RemoteSshInterface>({});

const configDB = new PouchDB("configs", {});

export function RemoteSshProvider(props: Props) {
  const { children } = props;

  const value: RemoteSshInterface = {};

  return (
    <RemoteSshContext.Provider value={value}>
      {children}
    </RemoteSshContext.Provider>
  );
}
