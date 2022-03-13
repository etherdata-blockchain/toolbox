import { ipcRenderer } from "electron";
import { ElectronChannels } from "../../shared/event_names";
import * as fs from "fs";

export class ElectronFS {
  static async writeFile(filename: string, content: string): Promise<void> {
    return await ipcRenderer.invoke(
      ElectronChannels.writeFileSync,
      filename,
      content
    );
  }

  static async readFile(filename: string): Promise<string> {
    return await ipcRenderer.invoke(ElectronChannels.readFileSync, filename);
  }
}
