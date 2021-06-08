//User Interface

//templates

const onTimeUI = document.querySelector(".on-time-template") as HTMLTemplateElement;
const tabataUI = document.querySelector(".tabata-template") as HTMLTemplateElement;
const armrapUI = document.querySelector(".armrap-template") as HTMLTemplateElement;
const selectUI = document.querySelector(".select-template") as HTMLTemplateElement;

//timer specific templates

const armrapTimer = document.querySelector(".timer-armrap-template") as HTMLTemplateElement;
const tabataTimer = document.querySelector(".timer-tabata-template") as HTMLTemplateElement;
const ontimeTimer = document.querySelector(".timer-ontime-template") as HTMLTemplateElement;

//render container
const app = document.getElementById("app")!;

const settings: timerSettings = {};

const renderContent = (el: HTMLTemplateElement) => {
  const importedNode = document.importNode(el.content, true);
  const HTMLContent = importedNode.firstElementChild as HTMLElement;

  if (app.firstElementChild?.hasChildNodes()) {
    console.log("re render po cofnieciu");
    app.firstElementChild.remove();
    app.insertAdjacentElement("afterbegin", HTMLContent);
  } else {
    app.insertAdjacentElement("afterbegin", HTMLContent);
  }
};

const addCounterListeners = () => {
  const counters = document.querySelectorAll(".select-time-container");

  counters.forEach(counter => {
    counter.lastElementChild?.firstElementChild?.addEventListener("click", e => {
      //MINUS

      setTimerSettings(e, "minus");
    });

    counter.lastElementChild?.lastElementChild?.addEventListener("click", e => {
      //PLUS

      setTimerSettings(e, "plus");
    });
  });
};

const setTimerSettings = (e: Event, operation: string) => {
  const clickedEl = e.target as HTMLElement;
  let currentValue: number = parseInt(clickedEl.parentElement!.parentElement?.children[1].textContent!); // kontener gdzie ustawia się pożądany czas
  const container = clickedEl.parentElement!.parentElement?.children[1]!;

  if (operation === "plus") {
    currentValue++;
  } else if (operation === "minus") {
    currentValue--;
    currentValue <= 0 && (currentValue = 0);
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
    switch (mode) {
      case "ON_TIME":
        renderContent(ontimeTimer);
        onTimeOnly(settings.durationSecs!, settings.durationMinutes!);
        break;
      case "TABATA":
        renderContent(tabataTimer);
        tabata(settings.durationSecs!, settings.durationMinutes!, settings.rest!, settings.rounds!);
        break;
      case "ARMRAP":
        renderContent(armrapTimer);
        armrap(settings.durationSecs!, settings.durationMinutes!);
        break;
    }
  });
};

const reRenderSettings = (mode: HTMLTemplateElement, modeName: string) => {
  renderContent(mode);
  addCounterListeners();
  setTimer(modeName, settings);
  backToHome();
};

const reRenderUI = () => {
  renderContent(selectUI);

  const onTimeBtn = document.querySelector(".on-time")! as HTMLDivElement;
  const tabataBtn = document.querySelector(".tabata")! as HTMLDivElement;
  const armrapBtn = document.querySelector(".armrap")! as HTMLDivElement;

  onTimeBtn.addEventListener("click", () => {
    const mode = "ON_TIME";

    renderContent(onTimeUI);

    backToHome();
    addCounterListeners();

    setTimer(mode, settings);
  });

  tabataBtn.addEventListener("click", () => {
    const mode = "TABATA";

    renderContent(tabataUI);
    backToHome();
    addCounterListeners();
    setTimer(mode, settings);
  });

  armrapBtn.addEventListener("click", () => {
    const mode = "ARMRAP";

    renderContent(armrapUI);
    backToHome();
    addCounterListeners();

    setTimer(mode, settings);
  });
};

document.addEventListener("DOMContentLoaded", reRenderUI);
