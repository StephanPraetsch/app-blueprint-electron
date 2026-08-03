import type {IpcRenderer, IpcRendererEvent} from "electron";
import {IPC_CHANNELS} from "../shared/ipcChannels.js";

const getIpcRenderer = (): IpcRenderer => {
  const requireFunction = (window as Window & {require?: NodeRequire}).require;
  if (typeof requireFunction !== "function") {
    throw new Error("Electron IPC is not available in this renderer context.");
  }

  const electronModule = requireFunction("electron") as {ipcRenderer?: IpcRenderer};
  if (electronModule.ipcRenderer === undefined) {
    throw new Error("ipcRenderer is not available.");
  }

  return electronModule.ipcRenderer;
};

const ensureNumber = (value: unknown): number => {
  if (typeof value !== "number") {
    throw new Error("Invalid click count response.");
  }
  return value;
};

const ensureString = (value: unknown, errorMessage: string): string => {
  if (typeof value !== "string") {
    throw new Error(errorMessage);
  }
  return value;
};

export const getCurrentClickCount = async (): Promise<number> => {
  const result = await getIpcRenderer().invoke(IPC_CHANNELS.getCurrentClickCount);
  return ensureNumber(result);
};

export const incrementClickCount = async (): Promise<number> => {
  const result = await getIpcRenderer().invoke(IPC_CHANNELS.incrementClickCount);
  return ensureNumber(result);
};

export const resetClickCount = async (): Promise<number> => {
  const result = await getIpcRenderer().invoke(IPC_CHANNELS.resetClickCount);
  return ensureNumber(result);
};

export const getDatabasePath = async (): Promise<string> => {
  const result = await getIpcRenderer().invoke(IPC_CHANNELS.getDatabasePath);
  return ensureString(result, "Invalid database path response.");
};

export const selectDatabasePath = async (): Promise<string | null> => {
  const result = await getIpcRenderer().invoke(IPC_CHANNELS.selectDatabasePath);
  if (result === null) {
    return null;
  }
  return ensureString(result, "Invalid selected database path response.");
};

export const createDatabasePath = async (): Promise<string | null> => {
  const result = await getIpcRenderer().invoke(IPC_CHANNELS.createDatabasePath);
  if (result === null) {
    return null;
  }
  return ensureString(result, "Invalid created database path response.");
};

export const openDatabasePathInFileBrowser = async (): Promise<void> => {
  await getIpcRenderer().invoke(IPC_CHANNELS.openDatabasePathInFileBrowser);
};

export const closeSettingsWindow = async (): Promise<void> => {
  await getIpcRenderer().invoke(IPC_CHANNELS.closeSettingsWindow);
};

export const onDatabasePathChanged = (callback: () => void): void => {
  getIpcRenderer().on(IPC_CHANNELS.databasePathChanged, (_event: IpcRendererEvent) => {
    callback();
  });
};

