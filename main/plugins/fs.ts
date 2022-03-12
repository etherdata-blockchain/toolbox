import { ipcMain } from "electron";
import { ElectronChannels } from "../../shared/event_names";
import * as fS from "fs";

ipcMain.handle(ElectronChannels.readFileSync, async (event, filename) => {
  return fS.readFileSync(filename, "utf-8");
});

ipcMain.handle(
  ElectronChannels.showMessageDialog,
  async (event, filename, content) => {
    return fS.writeFileSync(filename, content);
  }
);
