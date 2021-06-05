const _ = undefined;

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
    return timerID;
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

  const startArmrap = () => {
    let isTimeElapsed: boolean = false;

    if (mins === settings!.durationMinutes && secs === settings!.durationSecs) {
      console.log("over");
      isTimeElapsed = true;
    }

    return { isTimeElapsed };
  };

  const stopTimer = () => {
    const stopBtn = document.querySelector(".stop-btn");
    let id: NodeJS.Timeout;

    stopBtn?.addEventListener("click", () => {
      if (stopBtn.classList.contains("active")) {
        stopBtn.classList.remove("active");
        stopBtn.firstElementChild?.classList.replace("fa-play-circle", "fa-pause-circle");

        //continue timing
        console.log(timerID);
        id = startTimer(startArmrap);
      } else {
        stopBtn.classList.add("active");
        stopBtn.firstElementChild?.classList.replace("fa-pause-circle", "fa-play-circle");

        //pauza
        if (id) {
          clearInterval(id);
        } else {
          clearInterval(timerID);
        }
      }
    });
  };

  const armrapRoundCounter = () => {
    const countBtn = document.querySelector(".count-armrap-round")! as HTMLButtonElement;
    const roundNumberSpan = document.querySelector(".round-number")! as HTMLSpanElement;

    return countBtn.addEventListener("click", () => {
      rounds!++;
      roundNumberSpan.textContent = rounds!.toString();
    });
  };

  if (timerModeName === "ON_TIME") {
    startTimer(startOnTimeMode);
  }

  if (timerModeName === "TABATA") {
    //tu trzeba naprawić liczenie rund

    startTimer(startTabataMode);
  }

  if (timerModeName === "ARMRAP") {
    startTimer(startArmrap);
    armrapRoundCounter();
    stopTimer();
  }
};
