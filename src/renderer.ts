import {ClickCounter} from "./renderer/clickCounter.js";
import {Clock} from "./renderer/clock.js";
import {getRequiredElement} from "./renderer/dom.js";
import {getCurrentClickCount, incrementClickCount, onDatabasePathChanged, resetClickCount} from "./renderer/ipcClickCountGateway.js";

const currentTimeElement = getRequiredElement<HTMLElement>("current-time");
const clickOutputElement = getRequiredElement<HTMLElement>("click-output");
const clickCountButton = getRequiredElement<HTMLButtonElement>("click-count-button");
const resetClickCountButton = getRequiredElement<HTMLButtonElement>("reset-click-count-button");

const clock = new Clock(currentTimeElement);
const clickCounter = new ClickCounter(
  clickCountButton,
  resetClickCountButton,
  clickOutputElement,
  getCurrentClickCount,
  incrementClickCount,
  resetClickCount
);

clock.start();
await clickCounter.start();

onDatabasePathChanged(() => {
  void clickCounter.refresh();
});

