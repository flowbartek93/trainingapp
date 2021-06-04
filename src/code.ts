//DOM

const _ = undefined;

//Buttons

//templates

const onTimeUI = document.querySelector(".on-time-template") as HTMLTemplateElement;
const tabataUI = document.querySelector(".tabata-template") as HTMLTemplateElement;
const armrapUI = document.querySelector(".armrap-template") as HTMLTemplateElement;
const selectUI = document.querySelector(".select-template") as HTMLTemplateElement;

const timerUI = document.querySelector(".timer-template") as HTMLTemplateElement;

//render container
const app = document.getElementById("app")!;

//Important values;
let isCounting: boolean | null = null;
let timerID: number | NodeJS.Timeout | null;
let isPaused: boolean;

//Types
type timerData = {
  milsecs: number;
  secs: number;
  mins: number;
};

type timerSettings = {
  durationMinutes?: number;
  durationSecs?: number;
  rounds?: number;
  rest?: number;
};

const settings: timerSettings = {};

type clearTimer = (id: number | NodeJS.Timeout | null) => void;

const timer = (option: string, settings?: timerSettings, data?: timerData) => {
  const milsecsContainer = document.getElementById("timer__milsecs")! as HTMLSpanElement;
  const secsContainer = document.getElementById("timer__secs")! as HTMLSpanElement;
  const minsContainer = document.getElementById("timer__mins")! as HTMLSpanElement;

  let milsecs: number;
  let secs: number;
  let mins: number;

  let rounds: number | undefined = 0;

  const timerModeName: string = option;

  if (data) {
    milsecs = data.milsecs;
    secs = data.secs;
    mins = data.mins;
  } else {
    milsecs = 0;
    secs = 0;
    mins = 0;
  }

  const startTimer = (timerMode: () => any) => {
    const startCount = setInterval(() => {
      if (milsecs >= 100) {
        milsecs = 0;
        secs++;
      } else if (milsecs < 100) {
        milsecs++; // counting from milsecs
      }

      if (secs >= 60) {
        secs = 0;
        mins++;
      }

      if (timerMode) {
        const { isTimeElapsed, isTabataOver } = timerMode();

        if (isTimeElapsed || isTabataOver) {
          clearInterval(startCount);
        }
      }

      // milsecsContainer.textContent = milsecs === 1 && secs > 1 ? "00" : milsecs.toString();
      milsecsContainer.textContent = milsecs < 10 ? "0" + milsecs.toString() : milsecs.toString();
      secsContainer.textContent = secs < 10 ? "0" + secs.toString() : secs.toString();
      minsContainer.textContent = mins < 10 ? "0" + mins.toString() : mins.toString();
    }, 1);

    timerID = startCount;
  };

  const resetTimer = () => {
    milsecsContainer.textContent = "00";
    secsContainer.textContent = "00";
    minsContainer.textContent = "00";

    milsecs = 0;
    secs = 0;
    mins = 0;

    console.log("resetuje");
  };

  const startOnTimeMode = () => {
    let isTimeElapsed: boolean = false;

    if (mins === settings!.durationMinutes && secs === settings!.durationSecs) {
      isTimeElapsed = true;
    }

    return { isTimeElapsed };
  };

  const startRest = () => {
    resetTimer();

    let isTimeElapsed = false;

    startTimer(() => {
      if (secs === settings?.rest) {
        isTimeElapsed = true;
        resetTimer();
        startTimer(startTabataMode);
      }
      return { isTimeElapsed };
    });
  };

  const startTabataMode = () => {
    let isTimeElapsed: boolean = false;
    let isTabataOver: boolean = false;
    if (mins === settings!.durationMinutes && secs === settings!.durationSecs) {
      if (rounds === settings?.rounds) {
        isTabataOver = true;
      } else {
        startRest();
        rounds!++;
        console.log(rounds);
      }
      isTimeElapsed = true;
    }
    return { isTimeElapsed, isTabataOver };
  };

  if (timerModeName === "ON_TIME") {
    startTimer(startOnTimeMode);
  }

  if (timerModeName === "TABATA") {
    //tu trzeba naprawić liczenie rund

    startTimer(startTabataMode);
  }
};

// const getCurrentTime = () => {
//   let milsecs = parseInt(milsecsContainer.textContent!);
//   let secs = parseInt(secsContainer.textContent!);
//   let mins = parseInt(minsContainer.textContent!);

//   return {
//     milsecs,
//     secs,
//     mins
//   };
// };

const clearTimer = (id: number | null | NodeJS.Timeout) => {
  if (isPaused) {
    if (id) {
      if (typeof id === "number") {
        clearInterval(id);
      }
    }
  } else {
  }
};

//Timer modes

const onTimeOnly = (workSecs: number, workMins: number) => {
  const timeSetForMins = workMins || 0; //
  const timeSetForSecs = workSecs; //

  return timer("ON_TIME", { durationMinutes: timeSetForMins, durationSecs: timeSetForSecs }, _);
};

const tabata = (workSeconds: number, workMinutes: number, rest: number, rounds: number) => {
  const workInSeconds = workSeconds;
  const workInMinutes = workMinutes || 0;
  const restTime = rest || undefined;
  const roundsNumber = rounds || undefined;

  return timer(
    "TABATA",
    {
      durationMinutes: workInMinutes,
      durationSecs: workInSeconds,
      rest: restTime,
      rounds: roundsNumber
    },
    _
  );
};

//User Interface

const renderContent = (el: HTMLTemplateElement) => {
  const importedNode = document.importNode(el.content, true);
  const HTMLContent = importedNode.firstElementChild as HTMLElement;

  if (app.firstElementChild?.hasChildNodes()) {
    app.firstElementChild.remove();
    return app.insertAdjacentElement("afterbegin", HTMLContent);
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

const runTimerBtn = (mode: string, settings: timerSettings) => {
  const startBtn = document.querySelector(".start-btn")! as HTMLButtonElement;

  startBtn.addEventListener("click", () => {
    renderContent(timerUI);
    switch (mode) {
      case "on_time":
        onTimeOnly(settings.durationSecs!, settings.durationMinutes!);
        break;
      case "tabata":
        tabata(settings.durationSecs!, settings.durationMinutes!, settings.rest!, settings.rounds!);
        break;
      case "armrap":
        break;
    }
  });
};

const reRenderUI = () => {
  renderContent(selectUI);

  const onTimeBtn = document.querySelector(".on-time")! as HTMLDivElement;
  const tabataBtn = document.querySelector(".tabata")! as HTMLDivElement;
  const armrapBtn = document.querySelector(".armrap")! as HTMLDivElement;

  onTimeBtn.addEventListener("click", () => {
    const mode = "on_time";

    renderContent(onTimeUI);
    backToHome();
    addCounterListeners();

    runTimerBtn(mode, settings);
  });

  tabataBtn.addEventListener("click", () => {
    const mode = "tabata";

    renderContent(tabataUI);
    backToHome();
    addCounterListeners();
    runTimerBtn(mode, settings);
  });

  armrapBtn.addEventListener("click", () => {
    const mode = "armrap";

    renderContent(armrapUI);
    backToHome();
    addCounterListeners();
  });
};

document.addEventListener("DOMContentLoaded", reRenderUI);
