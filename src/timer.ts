const _ = undefined;

const timer = (option: string, settings: timerSettings, data?: timerData) => {
  //Spans that views timer iterations
  const milsecsContainer = document.getElementById("timer__milsecs")! as HTMLSpanElement;
  const secsContainer = document.getElementById("timer__secs")! as HTMLSpanElement;
  const minsContainer = document.getElementById("timer__mins")! as HTMLSpanElement;

  //Timer Buttons
  const resetBtn = document.querySelector(".reset-btn")! as HTMLButtonElement;
  const backBtn = document.querySelector(".back-menu")! as HTMLButtonElement;
  const stopBtn = document.querySelector(".stop-btn")! as HTMLButtonElement;

  let milsecs: number;
  let secs: number;
  let mins: number;

  let rounds: number | undefined = 1;

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
    return timerID;
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

    const title = document.querySelector(".rest-time")! as HTMLParagraphElement;
    title.style.display = "block";

    startTimer(() => {
      if (secs === settings?.rest) {
        isTimeElapsed = true;
        resetTimer();
        RoundCounter(); // automatyczne zliczenie rundy
        startTimer(startTabataMode);
        title.style.display = "none";
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
        rounds!++;
        startRest();
      }
      isTimeElapsed = true;
    }
    return { isTimeElapsed, isTabataOver };
  };

  const startArmrap = () => {
    let isTimeElapsed: boolean = false;

    if (mins === settings!.durationMinutes && secs === settings!.durationSecs) {
      console.log("over");
      isTimeElapsed = true;
    }

    return { isTimeElapsed };
  };

  //EVENTS TAKING PLACE WHEN TIMER IS RUNNING

  const eventListeners = (UIPart: HTMLTemplateElement, mode: () => {}) => {
    //Reset Buttons

    resetBtn?.addEventListener("click", () => {
      resetTimer();
    });

    //back to settings of particular timer
    backBtn.addEventListener("click", () => {
      backToSettings(UIPart);
    });

    //stop timer btn
    stopBtn?.addEventListener("click", () => {
      stopTimer(mode);
    });

    //count rounds when in armrap mode
    if (UIPart === armrapUI) {
      const countBtn = document.querySelector(".count-armrap-round")! as HTMLButtonElement;

      countBtn.addEventListener("click", () => {
        RoundCounter();
      });
    }
  };

  //FUNTIONS THAT ARE IN CONTROL OF TIMER

  const resetTimer = () => {
    milsecsContainer.textContent = "00";
    secsContainer.textContent = "00";
    minsContainer.textContent = "00";

    milsecs = 0;
    secs = 0;
    mins = 0;
  };

  const backToSettings = (mode: HTMLTemplateElement) => {
    resetTimer();
    reRenderSettings(mode, timerModeName);
  };

  const stopTimer = (mode: () => {}) => {
    if (stopBtn.classList.contains("active")) {
      //continue timing
      stopBtn.classList.remove("active");
      stopBtn.textContent = "stop !";
      isPaused = false;
      resetBtn.disabled = true;
      startTimer(mode);
    } else {
      //pauza
      stopBtn.classList.add("active");
      stopBtn.textContent = "go !";
      isPaused = true;
      resetBtn.disabled = false;
      clearInterval(timerID);
    }
  };

  const RoundCounter = () => {
    const roundNumberSpan = document.querySelector(".round-number")! as HTMLSpanElement;
    const roundNumberTotal = document.querySelector(".round-number-total")! as HTMLSpanElement;

    if (timerModeName === "ARMRAP") {
      rounds!++;
      roundNumberSpan.textContent = rounds!.toString();
    }

    if (timerModeName === "TABATA") {
      if (rounds === settings?.rounds) {
        roundNumberSpan.style.color = "brown";
      }
      roundNumberSpan.textContent = rounds!.toString();
      roundNumberTotal.textContent = settings!.rounds!.toString();
    }
  };

  if (timerModeName === "ON_TIME") {
    startTimer(startOnTimeMode);
    eventListeners(onTimeUI, startOnTimeMode);
  }

  if (timerModeName === "TABATA") {
    //tu trzeba naprawić liczenie rund

    startTimer(startTabataMode);
    RoundCounter();
    eventListeners(tabataUI, startTabataMode);
  }

  if (timerModeName === "ARMRAP") {
    rounds = 0;
    startTimer(startArmrap);
    eventListeners(armrapUI, startArmrap);
  }
};
