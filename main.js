const { app, BrowserWindow } = require("electron");
const path = require("path");
const { pathToFileURL } = require("url");

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  const htaPath = path.join(__dirname, "app", "Barpeta_Exam_Management_System.hta");
  win.loadURL(pathToFileURL(htaPath).href);
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
