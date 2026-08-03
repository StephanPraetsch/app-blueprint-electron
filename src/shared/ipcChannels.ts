export const IPC_CHANNELS = {
  getCurrentClickCount: "click-count:get-current",
  incrementClickCount: "click-count:increment",
  resetClickCount: "click-count:reset",
  databasePathChanged: "settings:database-path:changed",
  getDatabasePath: "settings:database-path:get",
  selectDatabasePath: "settings:database-path:select",
  createDatabasePath: "settings:database-path:create",
  openDatabasePathInFileBrowser: "settings:database-path:open-in-file-browser",
  closeSettingsWindow: "settings:window:close"
} as const;
