import {app, BrowserWindow} from "electron";
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {registerClickCountIpcHandlers} from "./main/adapters/inbound/ipc/registerClickCountIpcHandlers.js";
import {setupApplicationMenu} from "./main/adapters/inbound/menu/setupApplicationMenu.js";
import {DataBaseConfigLocalSqlite} from "./main/adapters/outbound/sqlite/DataBaseConfigLocalSqlite.js";
import {SqliteClickCountRepositoryFactory} from "./main/adapters/outbound/sqlite/SqliteClickCountRepositoryFactory.js";
import {ClickCountApplicationService} from "./main/application/services/ClickCountApplicationService.js";
import {showAboutDialog} from "./main/aboutDialog.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let mainWindow: BrowserWindow | null = null;
let settingsWindow: BrowserWindow | null = null;

const hasVersionFlag = process.argv.includes("--version") || process.argv.includes("-v");

if (hasVersionFlag) {
  const packageJsonPath = path.join(__dirname, "..", "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8")) as {version?: string};
  process.stdout.write(`${packageJson.version ?? "unknown"}\n`);
  process.exit(0);
}

const createMainWindow = (): BrowserWindow => {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
  void mainWindow.loadFile(path.join(__dirname, "index.html"));
  return mainWindow;
};

const openSettingsWindow = (): BrowserWindow => {
  if (settingsWindow !== null && !settingsWindow.isDestroyed()) {
    if (settingsWindow.isMinimized()) {
      settingsWindow.restore();
    }

    settingsWindow.focus();
    return settingsWindow;
  }

  settingsWindow = new BrowserWindow({
    width: 640,
    height: 420,
    title: "Settings",
    autoHideMenuBar: true,
    parent: BrowserWindow.getFocusedWindow() ?? mainWindow ?? undefined,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  settingsWindow.on("closed", () => {
    settingsWindow = null;
  });
  void settingsWindow.loadFile(path.join(__dirname, "settings.html"));
  return settingsWindow;
};

app.whenReady().then(async () => {
  const defaultDatabasePath = path.join(app.getPath("userData"), app.getName()+".sqlite");
  const settingsFilePath = path.join(app.getPath("userData"), "settings.json");
  const databasePathStore = new DataBaseConfigLocalSqlite(settingsFilePath, defaultDatabasePath);
  const repositoryFactory = new SqliteClickCountRepositoryFactory();
  const clickCountService = new ClickCountApplicationService(databasePathStore, repositoryFactory);

  registerClickCountIpcHandlers(clickCountService);

  createMainWindow();

  setupApplicationMenu({
    appName: app.name,
    appVersion: app.getVersion(),
    onAboutRequested: async () => {
      await showAboutDialog(app.name, app.getVersion());
    },
    onSettingsRequested: async () => {
      openSettingsWindow();
    }
  });

  app.on("activate", () => {
    if (mainWindow === null) {
      createMainWindow();
      return;
    }

    mainWindow.focus();
  });

  app.on("before-quit", () => {
    clickCountService.shutdown();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
