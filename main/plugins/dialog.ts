import { ipcMain, dialog } from "electron";
import { ElectronChannels } from "../../shared/event_names";
import * as fS from "fs";

ipcMain.handle(ElectronChannels.showOpenDialog, async (event, options) => {
  return await dialog.showOpenDialog(options);
});

ipcMain.handle(ElectronChannels.showMessageDialog, async (event, options) => {
  return await dialog.showMessageBox(options);
});

ipcMain.handle(ElectronChannels.showSaveDialog, async (event, options) => {
  const result = await dialog.showSaveDialog(options);

  if (!result.canceled) {
    fS.writeFileSync(result.filePath, "");
  }

  return result;
});
