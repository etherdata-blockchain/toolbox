import { RemoteActions } from "../../../renderer/component/remote_ssh/components/actions";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { RemoteSshProvider } from "../../../renderer/models/remoteSSH";
import "@testing-library/jest-dom";
import { ElectronDialog } from "../../../renderer/lib/electron_dialog";

jest.mock("../../../renderer/lib/electron_dialog");
jest.mock("../../../renderer/lib/remote_action");
jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/",
      pathname: "",
      query: {},
      asPath: "",
    };
  },
}));

describe("Given a remote action's action button", () => {
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

  beforeEach(() => {
    (ElectronDialog.showSaveDialog as any).mockClear();
    (ElectronDialog.showOpenDialog as any).mockClear();
  });

  test("When clicking the ok button without selecting any yaml file not canceled", async () => {
    (ElectronDialog.showSaveDialog as any).mockResolvedValue({
      canceled: false,
    });

    render(
      <RemoteSshProvider>
        <RemoteActions />
      </RemoteSshProvider>
    );
    const button = screen.getByTestId("add-btn");
    fireEvent.click(button);

    expect(
      await screen.findByTestId("add-new-config-modal")
    ).toBeInTheDocument();

    const okBtn = screen.getByText("OK");
    fireEvent.click(okBtn);
    expect(ElectronDialog.showSaveDialog).toBeCalledTimes(1);
  });

  test("When clicking the ok button when selecting any yaml file not canceled", async () => {
    (ElectronDialog.showOpenDialog as any).mockResolvedValue({
      canceled: false,
      filePaths: ["a.yaml"],
    });

    (ElectronDialog.showSaveDialog as any).mockResolvedValue({
      canceled: false,
    });

    render(
      <RemoteSshProvider>
        <RemoteActions />
      </RemoteSshProvider>
    );
    const button = screen.getByTestId("add-btn");
    fireEvent.click(button);

    expect(
      await screen.findByTestId("add-new-config-modal")
    ).toBeInTheDocument();

    const openFileBtn = screen.getByTestId("open-file-btn");
    fireEvent.click(openFileBtn);
    await waitFor(() => screen.getByText("Open File"));

    const okBtn = screen.getByText("OK");
    fireEvent.click(okBtn);
    expect(ElectronDialog.showOpenDialog).toBeCalledTimes(1);
    expect(ElectronDialog.showSaveDialog).toBeCalledTimes(0);
  });
});
