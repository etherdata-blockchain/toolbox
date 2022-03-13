import { app } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import "./plugins/block_exporter";
import "./plugins/remote_action";
import "./plugins/worker_checker";
import "./plugins/dialog";

const isProd: boolean = process.env.NODE_ENV === "production";

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow("Remote Config", {
    width: 1000,
    height: 600,
    webPreferences: {},
  });

  if (isProd) {
    await mainWindow.loadURL("app://./home.html");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on("window-all-closed", () => {
  app.quit();
});
