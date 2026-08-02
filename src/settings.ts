import {getRequiredElement} from "./renderer/dom.js";
import {closeSettingsWindow, getDatabasePath, openDatabasePathInFileBrowser, selectDatabasePath} from "./renderer/ipcClickCountGateway.js";
import {SettingsOverview} from "./renderer/settingsOverview.js";

const databaseFilePathElement = getRequiredElement<HTMLElement>("database-file-path");
const openDatabaseFileButton = getRequiredElement<HTMLButtonElement>("open-database-file-button");
const changeDatabaseFileButton = getRequiredElement<HTMLButtonElement>("change-database-file-button");
const closeSettingsButton = getRequiredElement<HTMLButtonElement>("close-settings-button");
const settingsStatusElement = getRequiredElement<HTMLElement>("settings-status");

const settingsOverview = new SettingsOverview(
  databaseFilePathElement,
  openDatabaseFileButton,
  changeDatabaseFileButton,
  closeSettingsButton,
  settingsStatusElement,
  getDatabasePath,
  selectDatabasePath,
  openDatabasePathInFileBrowser,
  closeSettingsWindow
);

await settingsOverview.start();

