import { ipcMain, Notification } from "electron";
import { BlockExporter } from "@etherdata-blockchain/block-exporter";
import { CancelablePromise } from "cancelable-promise";
import { ElectronChannels } from "../../shared/event_names";

let isBlockExporterStarted = false;

let cancelableBlockExporterJob: CancelablePromise<any> | undefined;

ipcMain.on(
  ElectronChannels.startBlockExporter,
  (e, { host, output, concurrency }: any) => {
    let blockExporter = new BlockExporter(host, undefined, output, concurrency);
    isBlockExporterStarted = true;
    e.reply("block-exporter-status-changed", isBlockExporterStarted);

    cancelableBlockExporterJob = blockExporter.check(
      (current, total, blockData) => {
        e.reply("block-exporter-update", { current, total, blockData });
      },
      (err) => {
        e.reply("block-exporter-error", err);
      }
    );

    cancelableBlockExporterJob
      .then(() => {
        isBlockExporterStarted = false;
        e.reply("block-exporter-status-changed", isBlockExporterStarted);
        new Notification({
          title: "Finished",
          subtitle: "Block Exporter",
        }).show();
      })
      .catch((err) => {
        isBlockExporterStarted = false;
        e.reply("block-exporter-status-changed", isBlockExporterStarted);
        e.reply("block-exporter-error", err);
      });
  }
);

ipcMain.on(ElectronChannels.stopBlockExporter, (e) => {
  cancelableBlockExporterJob?.cancel();
  isBlockExporterStarted = false;
  e.reply("block-exporter-status-changed", isBlockExporterStarted);
});
