const { app, BrowserWindow } = require("electron");
const path = require("path");

const isDev = !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      contextIsolation: true,
    },
  });

  const devURL = "http://localhost:5173";
  const prodURL = `file://${path.join(__dirname, "../renderer/dist/index.html")}`;

  win.loadURL(isDev ? devURL : prodURL);
}

app.whenReady().then(() => {
  createWindow();
});