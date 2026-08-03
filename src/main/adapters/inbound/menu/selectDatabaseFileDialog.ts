import {dialog} from "electron";

export const selectDatabaseFile = async (currentPath: string): Promise<string | null> => {
  const openResponse = await dialog.showOpenDialog({
    title: "Choose existing SQLite database file",
    defaultPath: currentPath,
    filters: [
      {name: "SQLite Database", extensions: ["sqlite", "db", "sqlite3"]},
      {name: "All Files", extensions: ["*"]}
    ],
    properties: ["openFile", "createDirectory"]
  });

  if (openResponse.canceled) {
    return null;
  }

  return openResponse.filePaths[0] ?? null;
};

export const createDatabaseFile = async (currentPath: string): Promise<string | null> => {
  const saveResponse = await dialog.showSaveDialog({
    title: "Create SQLite database file",
    defaultPath: currentPath,
    filters: [
      {name: "SQLite Database", extensions: ["sqlite", "db", "sqlite3"]},
      {name: "All Files", extensions: ["*"]}
    ],
    properties: ["createDirectory"]
  });

  if (saveResponse.canceled) {
    return null;
  }

  return saveResponse.filePath ?? null;
};

