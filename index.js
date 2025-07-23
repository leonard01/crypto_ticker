const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let win;

console.log("Preload path: ", path.join(__dirname, "preload.js"))

function createWindow() {
  win = new BrowserWindow({
    width: 300,
    height: 200,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    webPreferences: {
      preload: path.resolve(__dirname, "preload.js"), // ✅ Resolve preload properly
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadFile(path.resolve(__dirname, "index.html")); // ✅ Resolve HTML properly
}

// Shrink window height when header hidden
ipcMain.on("header-hide", () => {
  const bounds = win.getBounds();
  win.setBounds({
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height - 40,
  });
});

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
