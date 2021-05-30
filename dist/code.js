"use strict";
//DOM
const milsecsContainer = document.getElementById("timer__milsecs");
const secsContainer = document.getElementById("timer__secs");
const minsContainer = document.getElementById("timer__mins");
const _ = undefined;
//Buttons
const startBtn = document.querySelector(".startBtn");
const resetBtn = document.querySelector(".resetBtn");
//Important values;
let isCounting = null;
let timerID;
let isPaused;
const timer = (option, settings, data) => {
    let milsecs;
    let secs;
    let mins;
    let rounds = settings === null || settings === void 0 ? void 0 : settings.rounds;
    let rest = settings === null || settings === void 0 ? void 0 : settings.rest;
    const timerMode = option;
    if (data) {
        milsecs = data.milsecs;
        secs = data.secs;
        mins = data.mins;
    }
    else {
        milsecs = 0;
        secs = 0;
        mins = 0;
    }
    const startTimer = (timerMode) => {
        const startCount = setInterval(() => {
            if (milsecs >= 100) {
                milsecs = 0;
                secs++;
            }
            else if (milsecs < 100) {
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
    if (timerMode === "ON_TIME") {
        const startOnTimeMode = () => {
            if (mins === settings.durationMinutes && secs === settings.durationSecs) {
                const isTimeElapsed = true;
                resetBtn.disabled = false;
                return isTimeElapsed;
            }
        };
        startTimer(startOnTimeMode);
    }
    if (timerMode === "TABATA") {
        const startTabataMode = () => {
            let countRounds = 0;
            if (mins === settings.durationMinutes && secs === settings.durationSecs) {
                countRounds++;
                console.log("runda nr: ", countRounds);
                const isTimeElapsed = true;
                resetBtn.disabled = false;
                //wyzerowanie działa, teraz rest time
                resetTimer();
                return isTimeElapsed;
            }
        };
        startTimer(startTabataMode);
    }
};
const restTimer = (restTime) => {
    const startRest = setInterval;
};
const getCurrentTime = () => {
    let milsecs = parseInt(milsecsContainer.textContent);
    let secs = parseInt(secsContainer.textContent);
    let mins = parseInt(minsContainer.textContent);
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
    console.log("resetuje");
};
const clearTimer = (id) => {
    if (isPaused) {
        resetBtn.disabled = false;
        if (id) {
            if (typeof id === "number") {
                clearInterval(id);
            }
        }
    }
    else {
        resetBtn.disabled = true;
    }
};
//Timer modes
const onTimeOnly = (secs, mins) => {
    const timeSetForMins = mins || 0; //
    const timeSetForSecs = secs; //
    return timer("ON_TIME", { durationMinutes: timeSetForMins, durationSecs: timeSetForSecs }, _);
};
const tabata = (workSeconds, workMinutes, rest, rounds) => {
    const workInSeconds = workSeconds;
    const workInMinutes = workMinutes;
    const restTime = rest;
    const roundsNumber = rounds;
    return timer("TABATA", {
        durationMinutes: workInMinutes,
        durationSecs: workInSeconds,
        rest: restTime,
        rounds: roundsNumber
    }, _);
};
//User Interface
document.addEventListener("DOMContentLoaded", () => {
    startBtn.addEventListener("click", (e) => {
        const button = e.target;
        if (button.classList.contains("active")) {
            //pause timer
            button.classList.remove("active");
            startBtn.textContent = "Start";
            isPaused = true;
            clearTimer(timerID);
        }
        else {
            //run timer
            button.classList.add("active");
            startBtn.textContent = "Pause";
            isPaused = false;
            resetBtn.disabled = true;
        }
    });
    resetBtn.addEventListener("click", resetTimer);
});
// tabata(30, 5, 20, 3);
