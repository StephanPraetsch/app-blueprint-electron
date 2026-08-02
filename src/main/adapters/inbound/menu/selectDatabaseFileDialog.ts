import {dialog} from "electron";

export const selectDatabaseFile = async (currentPath: string): Promise<string | null> => {
  const saveResponse = await dialog.showSaveDialog({
    title: "Choose SQLite database file",
    defaultPath: currentPath,
    filters: [
      {name: "SQLite Database", extensions: ["sqlite", "db", "sqlite3"]},
      {name: "All Files", extensions: ["*"]}
    ],
    properties: ["createDirectory", "showOverwriteConfirmation"]
  });

  if (saveResponse.canceled) {
    return null;
  }

  return saveResponse.filePath ?? null;
};

