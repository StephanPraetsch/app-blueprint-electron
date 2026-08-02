import {BrowserWindow, ipcMain, shell} from "electron";
import type {ClickCountApplicationService} from "../../../application/services/ClickCountApplicationService.js";
import {IPC_CHANNELS} from "../../../../shared/ipcChannels.js";
import {selectDatabaseFile} from "../menu/selectDatabaseFileDialog.js";

export const registerClickCountIpcHandlers = (service: ClickCountApplicationService): void => {
  ipcMain.handle(IPC_CHANNELS.getCurrentClickCount, () => {
    return service.getCurrentClickCount();
  });

  ipcMain.handle(IPC_CHANNELS.incrementClickCount, () => {
    return service.incrementClickCount();
  });

  ipcMain.handle(IPC_CHANNELS.resetClickCount, () => {
    return service.resetClickCount();
  });

  ipcMain.handle(IPC_CHANNELS.getDatabasePath, () => {
    return service.getDatabasePath();
  });

  ipcMain.handle(IPC_CHANNELS.selectDatabasePath, async () => {
    const selectedPath = await selectDatabaseFile(service.getDatabasePath());
    if (selectedPath === null) {
      return null;
    }

    service.setDatabasePath(selectedPath);
    BrowserWindow.getAllWindows().forEach((window) => {
      window.webContents.send(IPC_CHANNELS.databasePathChanged);
    });
    return service.getDatabasePath();
  });

  ipcMain.handle(IPC_CHANNELS.openDatabasePathInFileBrowser, () => {
    shell.showItemInFolder(service.getDatabasePath());
  });

  ipcMain.handle(IPC_CHANNELS.closeSettingsWindow, (event) => {
    BrowserWindow.fromWebContents(event.sender)?.close();
  });
};
