//DOM

const milsecsContainer = document.getElementById("timer__milsecs")! as HTMLSpanElement;
const secsContainer = document.getElementById("timer__secs")! as HTMLSpanElement;
const minsContainer = document.getElementById("timer__mins")! as HTMLSpanElement;
const _ = undefined;
//Buttons
const startBtn = document.querySelector(".startBtn")! as HTMLButtonElement;
const resetBtn = document.querySelector(".resetBtn")! as HTMLButtonElement;
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

const timer = (settings?: timerSettings, data?: timerData) => {
  let milsecs: number;
  let secs: number;
  let mins: number;

  if (data) {
    milsecs = data.milsecs;
    secs = data.secs;
    mins = data.mins;
  } else {
    milsecs = 0;
    secs = 0;
    mins = 0;
  }

  const startCount = setInterval(() => {
    if (settings) {
      if (secs === settings.durationSecs) {
        console.log(milsecs);
        clearInterval(startCount);
      }
    }

    if (milsecs >= 100) {
      milsecs = 0;
      console.log(milsecs);
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
  }, 1);

  return { startCount };
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

const resetTimer = () => {
  milsecsContainer.textContent = "00";
  secsContainer.textContent = "00";
  minsContainer.textContent = "00";

  clearTimer(timerID);
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
    return;
  }
};

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
      const { startCount } = timer(_, getCurrentTime());
      timerID = startCount;
      isPaused = false;
      console.log("start");
      resetBtn.disabled = true;
    }
  });

  resetBtn.addEventListener("click", resetTimer);
});

// timer({ durationSecs: 10 });
