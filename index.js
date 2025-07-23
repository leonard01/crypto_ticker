const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 300,
    height: 100,
    frame: false,                  // ✅ No system frame
    transparent: true,             // ✅ Fully transparent
    backgroundColor: '#00000000',  // ✅ Force transparent background
    title: "",                     // ✅ No window title
    skipTaskbar: true,             // ✅ Hide from Alt+Tab and taskbar
    focusable: false,              // ✅ OS doesn’t give it focus
    alwaysOnTop: true,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadFile("index.html");

  // Optional: Prevent Windows ghost frame by setting window type
  win.setAlwaysOnTop(true, "screen-saver");
}

app.setName(""); // ✅ Strip process name

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
