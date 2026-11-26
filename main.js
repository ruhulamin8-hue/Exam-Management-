const { app, BrowserWindow } = require("electron");
const fs = require("fs");
const path = require("path");
const http = require("http");

const PORT = 8765;
let server = null;

function extractEmbeddedApp() {
  const htaPath = path.join(app.getAppPath(), "app", "Barpeta_Exam_Management_System.hta");
  const source = fs.readFileSync(htaPath, "utf8");
  const match = source.match(/var\s+APP_B64\s*=\s*\[(.*?)\]\.join\(""\);/s);
  if (!match) throw new Error("Could not find the embedded application in the HTA file.");
  const parts = [...match[1].matchAll(/"([^"]*)"/g)].map(m => m[1]);
  return Buffer.from(parts.join(""), "base64");
}

function startLocalServer(appHtml) {
  return new Promise((resolve, reject) => {
    server = http.createServer((req, res) => {
      if (req.url === "/__ping") {
        res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("ok");
        return;
      }
      if (req.url === "/" || req.url === "/index.html") {
        res.writeHead(200, {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store"
        });
        res.end(appHtml);
        return;
      }
      res.writeHead(404);
      res.end("Not found");
    });
    server.once("error", reject);
    server.listen(PORT, "127.0.0.1", resolve);
  });
}

async function createWindow() {
  const appHtml = extractEmbeddedApp();
  await startLocalServer(appHtml);

  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  // The original HTA launcher uses http://localhost:8765 so that
  // Google OAuth can work. Keep the same origin in the EXE.
  await win.loadURL(`http://localhost:${PORT}/`);

  win.on("closed", () => {
    if (server) {
      server.close();
      server = null;
    }
  });
}

app.whenReady().then(() => {
  createWindow().catch(err => console.error(err));
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow().catch(console.error);
  });
});

app.on("window-all-closed", () => {
  if (server) server.close();
  if (process.platform !== "darwin") app.quit();
});
