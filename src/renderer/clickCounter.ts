export type GetCurrentClickCount = () => Promise<number>;
export type IncrementClickCount = () => Promise<number>;
export type ResetClickCount = () => Promise<number>;

export class ClickCounter {
  private readonly incrementButton: HTMLButtonElement;
  private readonly resetButton: HTMLButtonElement;
  private readonly output: HTMLElement;
  private readonly getCurrentClickCount: GetCurrentClickCount;
  private readonly incrementClickCount: IncrementClickCount;
  private readonly resetClickCount: ResetClickCount;

  public constructor(
    incrementButton: HTMLButtonElement,
    resetButton: HTMLButtonElement,
    output: HTMLElement,
    getCurrentClickCount: GetCurrentClickCount,
    incrementClickCount: IncrementClickCount,
    resetClickCount: ResetClickCount
  ) {
    this.incrementButton = incrementButton;
    this.resetButton = resetButton;
    this.output = output;
    this.getCurrentClickCount = getCurrentClickCount;
    this.incrementClickCount = incrementClickCount;
    this.resetClickCount = resetClickCount;
  }

  public async start(): Promise<void> {
    await this.initializeFromStorage();

    this.incrementButton.addEventListener("click", async () => {
      try {
        const currentCount = await this.incrementClickCount();
        this.output.textContent = this.toLabel(currentCount);
      } catch (error) {
        this.output.textContent = `Failed to store click: ${this.toErrorMessage(error)}`;
      }
    });

    this.resetButton.addEventListener("click", async () => {
      try {
        const currentCount = await this.resetClickCount();
        this.output.textContent = this.toLabel(currentCount);
      } catch (error) {
        this.output.textContent = `Failed to reset click count: ${this.toErrorMessage(error)}`;
      }
    });
  }

  private async initializeFromStorage(): Promise<void> {
    try {
      const currentCount = await this.getCurrentClickCount();
      this.output.textContent = this.toLabel(currentCount);
    } catch (error) {
      this.output.textContent = `Failed to load click count: ${this.toErrorMessage(error)}`;
    }
  }

  private toLabel(count: number): string {
    return `Clicked ${count} time${count === 1 ? "" : "s"}`;
  }

  private toErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : "Unknown error";
  }
}
