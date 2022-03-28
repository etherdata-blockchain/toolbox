import fs from "fs";
import "@testing-library/jest-dom";
import { Config, WorkerStatus } from "@etherdata-blockchain/remote-action";
import YAML from "yaml";
import { render, screen, waitFor } from "@testing-library/react";
import { RemoteSshProvider } from "../../../renderer/models/remoteSSH";
import Page from "../../../renderer/pages/remote_ssh/[id]";
import { WorkerDetail } from "../../../renderer/component/remote_ssh/components/WorkerDetail";

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

const mockRemoteAction2: Config = {
  login: {
    username: "hello",
    password: "world",
  },
  name: "Hello world",
  output: false,
  remote: ["192.168.0.1", "192.168.0.2", "192.168.0.3"],
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

describe("Given a detail page", () => {
  beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  test("When given a saved configuration", async () => {
    (fs.readFileSync as any).mockReturnValue(YAML.stringify(mockRemoteAction));
    (fs.existsSync as any).mockReturnValue(true);
    render(
      <RemoteSshProvider>
        <Page />
      </RemoteSshProvider>
    );

    await waitFor(() => screen.getByTestId("container"));
    expect(screen.getByText("Running workers")).toBeInTheDocument();
  });
});

describe("Given a worker component", () => {
  beforeAll(() => {
    Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
      configurable: true,
      value: 50,
    });
    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
      configurable: true,
      value: 50,
    });
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: true,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  test("When given a saved configuration", async () => {
    (fs.readFileSync as any).mockReturnValue(YAML.stringify(mockRemoteAction));
    (fs.existsSync as any).mockReturnValue(true);
    const worker: WorkerStatus = {
      errorStopped: false,
      errors: [],
      isFinished: false,
      outputs: [{ output: "hello world", index: 0, progress: 0 }],
      remoteIP: "",
      results: [],
      totalOutputs: [],
    };

    render(
      <RemoteSshProvider>
        <WorkerDetail actionConfig={mockRemoteAction} workers={[worker]} />
      </RemoteSshProvider>
    );

    await waitFor(() => screen.getByTestId("container"));
    expect(screen.getAllByText("List data").length).toBe(1);
    expect(screen.getAllByText("cd /home").length).toBe(1);
  });

  test("When given a saved configuration with multiple remotes", async () => {
    (fs.readFileSync as any).mockReturnValue(YAML.stringify(mockRemoteAction));
    (fs.existsSync as any).mockReturnValue(true);
    const worker: WorkerStatus = {
      errorStopped: false,
      errors: [],
      isFinished: false,
      outputs: [{ output: "hello world", index: 0, progress: 0 }],
      remoteIP: "",
      results: [],
      totalOutputs: [],
    };

    const worker2: WorkerStatus = {
      errorStopped: false,
      errors: [],
      isFinished: false,
      outputs: [{ output: "hello world", index: 1, progress: 0 }],
      remoteIP: "",
      results: [],
      totalOutputs: [],
    };

    const worker3: WorkerStatus = {
      errorStopped: false,
      errors: [],
      isFinished: false,
      outputs: [{ output: "hello world", index: 2, progress: 0 }],
      remoteIP: "",
      results: [],
      totalOutputs: [],
    };

    render(
      <RemoteSshProvider>
        <WorkerDetail
          actionConfig={mockRemoteAction2}
          workers={[worker, worker2, worker3]}
        />
      </RemoteSshProvider>
    );

    await waitFor(() => screen.getByTestId("container"));
    expect(screen.getAllByText("List data").length).toBe(3);
    expect(screen.getAllByText("cd /home").length).toBe(3);
  });
});
