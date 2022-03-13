import PouchDB from "pouchdb";
import fs from "fs";
import "@testing-library/jest-dom";
import { Config } from "@etherdata-blockchain/remote-action";
import YAML from "yaml";
import { render, screen, waitFor } from "@testing-library/react";
import { db, RemoteSshProvider } from "../../../renderer/models/remoteSSH";
import Page from "../../../renderer/pages/remote_ssh/edit/[id]";

jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/",
      pathname: "",
      query: { id: "1" },
      asPath: "",
    };
  },
}));

const mockRemoteAction: Config = {
  login: {
    username: "hello",
    password: "world",
  },
  name: "Hello world",
  output: false,
  remote: ["192.168.0.1"],
  steps: [
    {
      run: "ls",
      name: "List data",
    },
    {
      run: "cd /home",
    },
  ],
};

jest.mock("pouchdb");

jest.mock("fs");

jest.mock("../../../renderer/lib/remote_action");

describe("Given a editing page", () => {
  test("When given a saved configuration", async () => {
    (fs.readFileSync as any).mockReturnValue(YAML.stringify(mockRemoteAction));
    (fs.existsSync as any).mockReturnValue(true);
    render(
      <RemoteSshProvider>
        <Page />
      </RemoteSshProvider>
    );

    await waitFor(() => screen.getByTestId("container"));

    // screen.debug(undefined, 300000);
    const name = screen.getAllByLabelText("name");
    expect(name.length).toBe(3);
    expect((name[0] as HTMLInputElement).value).toBe("Hello world");

    const runs = screen.getAllByLabelText("run");
    expect(runs.length).toBe(2);

    expect((runs[0] as HTMLInputElement).value).toBe(
      mockRemoteAction.steps[0].run
    );

    expect((runs[1] as HTMLInputElement).value).toBe(
      mockRemoteAction.steps[1].run
    );
  });

  test("When given a saved configuration", async () => {
    (fs.readFileSync as any).mockReturnValue(YAML.stringify(mockRemoteAction));
    (fs.existsSync as any).mockReturnValue(false);
    render(
      <RemoteSshProvider>
        <Page />
      </RemoteSshProvider>
    );

    await waitFor(() => screen.getByText("Something went wrong"));
  });
});
