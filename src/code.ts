//DOM

const milsecsContainer = document.getElementById("timer__milsecs")! as HTMLSpanElement;
const secsContainer = document.getElementById("timer__secs")! as HTMLSpanElement;
const minsContainer = document.getElementById("timer__mins")! as HTMLSpanElement;
const _ = undefined;
//Buttons
const startBtn = document.querySelector(".startBtn")! as HTMLButtonElement;
const resetBtn = document.querySelector(".resetBtn")! as HTMLButtonElement;

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

type clearTimer = (id: number | NodeJS.Timeout | null) => void;

const timer = (option: string, settings?: timerSettings, data?: timerData) => {
  let milsecs: number;
  let secs: number;
  let mins: number;

  let rounds: number | undefined = settings?.rounds;
  let rest: number | undefined = settings?.rest;
  const timerMode = option;

  if (data) {
    milsecs = data.milsecs;
    secs = data.secs;
    mins = data.mins;
  } else {
    milsecs = 0;
    secs = 0;
    mins = 0;
  }

  const startTimer = (timerMode: () => boolean | undefined) => {
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

      // milsecsContainer.textContent = milsecs === 1 && secs > 1 ? "00" : milsecs.toString();
      milsecsContainer.textContent = milsecs < 10 ? "0" + milsecs.toString() : milsecs.toString();
      secsContainer.textContent = secs < 10 ? "0" + secs.toString() : secs.toString();
      minsContainer.textContent = mins < 10 ? "0" + mins.toString() : mins.toString();

      const timeElapsed = timerMode();

      if (timeElapsed) {
        clearInterval(startCount);
      }
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
    if (mins === settings!.durationMinutes && secs === settings!.durationSecs) {
      const isTimeElapsed: boolean = true;

      resetBtn.disabled = false;
      return isTimeElapsed;
    }
  };

  const startRest = () => {
    let endOfPause = false;
    resetTimer();

    startTimer(() => {
      if (secs === rest) {
        endOfPause = true;
        resetTimer();
        return endOfPause;
      }
    });
  };

  const startTabataMode = () => {
    if (mins === settings!.durationMinutes && secs === settings!.durationSecs) {
      const isTimeElapsed: boolean = true;
      resetBtn.disabled = false;
      //wyzerowanie działa, teraz rest time
      resetTimer();
      startRest();
      return isTimeElapsed;
    }
  };

  if (timerMode === "ON_TIME") {
  }

  if (timerMode === "TABATA") {
    let countRounds: number = 0;

    return (function () {
      while (countRounds < rounds!) {
        countRounds++;
        startTimer(startTabataMode);
      }
    })();
  }
};

const getCurrentTime = () => {
  let milsecs = parseInt(milsecsContainer.textContent!);
  let secs = parseInt(secsContainer.textContent!);
  let mins = parseInt(minsContainer.textContent!);

  return {
    milsecs,
    secs,
    mins
  };
};

const clearTimer = (id: number | null | NodeJS.Timeout) => {
  if (isPaused) {
    resetBtn.disabled = false;

    if (id) {
      if (typeof id === "number") {
        clearInterval(id);
      }
    }
  } else {
    resetBtn.disabled = true;
  }
};

//Timer modes

const onTimeOnly = (secs: number, mins: number) => {
  const timeSetForMins = mins || 0; //
  const timeSetForSecs = secs; //

  return timer("ON_TIME", { durationMinutes: timeSetForMins, durationSecs: timeSetForSecs }, _);
};

const tabata = (workSeconds: number, workMinutes: number, rest: number, rounds: number) => {
  const workInSeconds = workSeconds;
  const workInMinutes = workMinutes;
  const restTime = rest;
  const roundsNumber = rounds;

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

document.addEventListener("DOMContentLoaded", () => {
  startBtn.addEventListener("click", (e: Event) => {
    const button = e.target as HTMLButtonElement;

    if (button.classList.contains("active")) {
      //pause timer
      button.classList.remove("active");
      startBtn.textContent = "Start";
      isPaused = true;
      clearTimer(timerID);
    } else {
      //run timer
      button.classList.add("active");
      startBtn.textContent = "Pause";
      isPaused = false;
      resetBtn.disabled = true;
    }
  });
});

// tabata(30, 5, 20, 3);
