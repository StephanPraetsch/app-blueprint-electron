export type GetDatabasePath = () => Promise<string>;
export type SelectDatabasePath = () => Promise<string | null>;
export type OpenDatabasePathInFileBrowser = () => Promise<void>;
export type CloseSettingsWindow = () => Promise<void>;

export class SettingsOverview {
  private readonly databasePathOutput: HTMLElement;
  private readonly openInFileBrowserButton: HTMLButtonElement;
  private readonly changeDatabasePathButton: HTMLButtonElement;
  private readonly closeButton: HTMLButtonElement;
  private readonly statusOutput: HTMLElement;
  private readonly getDatabasePath: GetDatabasePath;
  private readonly selectDatabasePath: SelectDatabasePath;
  private readonly openDatabasePathInFileBrowser: OpenDatabasePathInFileBrowser;
  private readonly closeSettingsWindow: CloseSettingsWindow;

  public constructor(
    databasePathOutput: HTMLElement,
    openInFileBrowserButton: HTMLButtonElement,
    changeDatabasePathButton: HTMLButtonElement,
    closeButton: HTMLButtonElement,
    statusOutput: HTMLElement,
    getDatabasePath: GetDatabasePath,
    selectDatabasePath: SelectDatabasePath,
    openDatabasePathInFileBrowser: OpenDatabasePathInFileBrowser,
    closeSettingsWindow: CloseSettingsWindow
  ) {
    this.databasePathOutput = databasePathOutput;
    this.openInFileBrowserButton = openInFileBrowserButton;
    this.changeDatabasePathButton = changeDatabasePathButton;
    this.closeButton = closeButton;
    this.statusOutput = statusOutput;
    this.getDatabasePath = getDatabasePath;
    this.selectDatabasePath = selectDatabasePath;
    this.openDatabasePathInFileBrowser = openDatabasePathInFileBrowser;
    this.closeSettingsWindow = closeSettingsWindow;
  }

  public async start(): Promise<void> {
    await this.refreshDatabasePath();

    this.openInFileBrowserButton.addEventListener("click", async () => {
      try {
        await this.openDatabasePathInFileBrowser();
        this.statusOutput.textContent = "Opened database location in file browser.";
      } catch (error) {
        this.statusOutput.textContent = `Failed to open database location: ${this.toErrorMessage(error)}`;
      }
    });

    this.changeDatabasePathButton.addEventListener("click", async () => {
      try {
        const selectedPath = await this.selectDatabasePath();
        if (selectedPath === null) {
          this.statusOutput.textContent = "Database file path unchanged.";
          return;
        }

        this.databasePathOutput.textContent = selectedPath;
        this.statusOutput.textContent = "Database file path updated.";
      } catch (error) {
        this.statusOutput.textContent = `Failed to change database file path: ${this.toErrorMessage(error)}`;
      }
    });

    this.closeButton.addEventListener("click", async () => {
      try {
        await this.closeSettingsWindow();
      } catch (error) {
        this.statusOutput.textContent = `Failed to close settings window: ${this.toErrorMessage(error)}`;
      }
    });

    window.addEventListener("keydown", async (event) => {
      if (event.key !== "Escape") {
        return;
      }

      event.preventDefault();
      try {
        await this.closeSettingsWindow();
      } catch (error) {
        this.statusOutput.textContent = `Failed to close settings window: ${this.toErrorMessage(error)}`;
      }
    });

    this.changeDatabasePathButton.focus();
  }

  private async refreshDatabasePath(): Promise<void> {
    try {
      this.databasePathOutput.textContent = await this.getDatabasePath();
      this.statusOutput.textContent = "";
    } catch (error) {
      this.databasePathOutput.textContent = "Unavailable";
      this.statusOutput.textContent = `Failed to load database path: ${this.toErrorMessage(error)}`;
    }
  }

  private toErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : "Unknown error";
  }
}

