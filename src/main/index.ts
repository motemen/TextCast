import { app, BrowserWindow, screen } from "electron";
import * as path from "path";
import { format as formatUrl } from "url";
import * as express from "express";
import * as readline from "readline";
import * as commandLineArgs from "command-line-args";

const options = commandLineArgs(
  [
    {
      name: "port",
      alias: "p",
      type: Number,
      defaultValue: 4140
    }
  ],
  {
    partial: true
  }
);

const isDevelopment = process.env.NODE_ENV !== "production";

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow: BrowserWindow | null;

function createMainWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const window = new BrowserWindow({
    webPreferences: { nodeIntegration: true },
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    x: 0,
    y: 0,
    width,
    height
  });
  window.setIgnoreMouseEvents(true);

  if (isDevelopment) {
    window.webContents.openDevTools({ mode: "detach" });
  }

  if (isDevelopment) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  } else {
    window.loadURL(
      formatUrl({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file",
        slashes: true
      })
    );
  }

  window.on("closed", () => {
    mainWindow = null;
  });

  window.webContents.on("devtools-opened", () => {
    window.focus();
    setImmediate(() => {
      window.focus();
    });
  });

  return window;
}

// quit application when all windows are closed
app.on("window-all-closed", () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow();
  }
});

// create main BrowserWindow when electron is ready
app.on("ready", () => {
  mainWindow = createMainWindow();

  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.post("/post", (req, res) => {
    mainWindow!.webContents.send("NEW_TEXT", req.body.text);
    res.send();
  });
  app.put("/stream", (req, res) => {
    const rl = readline.createInterface({ input: req });
    rl.on("line", line => {
      mainWindow!.webContents.send("NEW_TEXT", line);
    });
    rl.on("close", () => {
      res.send();
    });
  });
  app.listen(options.port, "localhost");
});