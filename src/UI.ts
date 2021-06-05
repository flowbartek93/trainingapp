//User Interface

//templates

const onTimeUI = document.querySelector(".on-time-template") as HTMLTemplateElement;
const tabataUI = document.querySelector(".tabata-template") as HTMLTemplateElement;
const armrapUI = document.querySelector(".armrap-template") as HTMLTemplateElement;
const selectUI = document.querySelector(".select-template") as HTMLTemplateElement;

const timerUI = document.querySelector(".timer-template") as HTMLTemplateElement;

//timer specific templates

const armrapTimer = document.querySelector(".timer-armrap-template") as HTMLTemplateElement;
const tabataTimer = document.querySelector(".timer-tabata-template") as HTMLTemplateElement;
const ontimeTimer = document.querySelector(".timer-ontime-template") as HTMLTemplateElement;

//render container
const app = document.getElementById("app")!;

const renderContent = (el: HTMLTemplateElement, timerSpecific: boolean) => {
  const importedNode = document.importNode(el.content, true);
  const HTMLContent = importedNode.firstElementChild as HTMLElement;

  if (app.firstElementChild?.hasChildNodes()) {
    if (timerSpecific) {
      return app.insertAdjacentElement("beforeend", HTMLContent);
    } else {
      app.firstElementChild.remove();
      return app.insertAdjacentElement("afterbegin", HTMLContent);
    }
  } else {
    return app.insertAdjacentElement("afterbegin", HTMLContent);
  }
};

const addCounterListeners = () => {
  const counters = document.querySelectorAll(".select-time-container");

  counters.forEach(counter => {
    counter.lastElementChild?.firstElementChild?.addEventListener("click", e => {
      //MINUS

      countSettings(e, "minus");
    });
    counter.lastElementChild?.lastElementChild?.addEventListener("click", e => {
      //PLUS

      countSettings(e, "plus");
    });
  });
};

const countSettings = (e: Event, operation: string) => {
  const clickedEl = e.target as HTMLElement;
  let currentValue: number = parseInt(clickedEl.parentElement!.parentElement?.children[1].textContent!); // kontener gdzie ustawia się pożądany czas
  const container = clickedEl.parentElement!.parentElement?.children[1]!;

  currentValue <= 0 && (currentValue = 0);

  if (operation === "plus") {
    currentValue++;
  } else if (operation === "minus") {
    currentValue--;
  }

  container.textContent = currentValue.toString();

  if (container.classList.contains("seconds")) {
    settings.durationSecs = currentValue;
  }

  if (container.classList.contains("minutes")) {
    settings.durationMinutes = currentValue;
  }

  if (container.classList.contains("rest")) {
    settings.rest = currentValue;
  }

  if (container.classList.contains("rounds")) {
    settings.rounds = currentValue;
  }
  console.log(settings);
};

const backToHome = () => {
  const backBtn = document.querySelector(".back-btn")! as HTMLButtonElement;

  return backBtn.addEventListener("click", () => {
    reRenderUI();
  });
};

const setTimer = (mode: string, settings: timerSettings) => {
  const startBtn = document.querySelector(".start-btn")! as HTMLButtonElement;

  startBtn.addEventListener("click", () => {
    renderContent(timerUI, false); //rendering timera, bez względu na mode

    switch (mode) {
      case "on_time":
        onTimeOnly(settings.durationSecs!, settings.durationMinutes!);
        break;
      case "tabata":
        tabata(settings.durationSecs!, settings.durationMinutes!, settings.rest!, settings.rounds!);
        break;
      case "armrap":
        renderContent(armrapTimer, true);
        armrap(settings.durationSecs!, settings.durationMinutes!);
        break;
    }
  });
};

const reRenderUI = () => {
  renderContent(selectUI, false);

  const onTimeBtn = document.querySelector(".on-time")! as HTMLDivElement;
  const tabataBtn = document.querySelector(".tabata")! as HTMLDivElement;
  const armrapBtn = document.querySelector(".armrap")! as HTMLDivElement;

  onTimeBtn.addEventListener("click", () => {
    const mode = "on_time";

    renderContent(onTimeUI, false);
    backToHome();
    addCounterListeners();

    setTimer(mode, settings);
  });

  tabataBtn.addEventListener("click", () => {
    const mode = "tabata";

    renderContent(tabataUI, false);
    backToHome();
    addCounterListeners();
    setTimer(mode, settings);
  });

  armrapBtn.addEventListener("click", () => {
    const mode = "armrap";

    renderContent(armrapUI, false);
    backToHome();
    addCounterListeners();

    setTimer(mode, settings);
  });
};

document.addEventListener("DOMContentLoaded", reRenderUI);
