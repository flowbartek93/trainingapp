"use strict";
const _ = undefined;
const timer = (option, settings, data) => {
    const milsecsContainer = document.getElementById("timer__milsecs");
    const secsContainer = document.getElementById("timer__secs");
    const minsContainer = document.getElementById("timer__mins");
    let milsecs;
    let secs;
    let mins;
    let rounds = 0;
    const timerModeName = option;
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
        let isTimeElapsed = false;
        if (mins === settings.durationMinutes && secs === settings.durationSecs) {
            isTimeElapsed = true;
        }
        return { isTimeElapsed };
    };
    const startRest = () => {
        resetTimer();
        let isTimeElapsed = false;
        startTimer(() => {
            if (secs === (settings === null || settings === void 0 ? void 0 : settings.rest)) {
                isTimeElapsed = true;
                resetTimer();
                startTimer(startTabataMode);
            }
            return { isTimeElapsed };
        });
    };
    const startTabataMode = () => {
        let isTimeElapsed = false;
        let isTabataOver = false;
        if (mins === settings.durationMinutes && secs === settings.durationSecs) {
            if (rounds === (settings === null || settings === void 0 ? void 0 : settings.rounds)) {
                isTabataOver = true;
            }
            else {
                startRest();
                rounds++;
                console.log(rounds);
            }
            isTimeElapsed = true;
        }
        return { isTimeElapsed, isTabataOver };
    };
    const startArmrap = () => {
        let isTimeElapsed = false;
        if (mins === settings.durationMinutes && secs === settings.durationSecs) {
            console.log("over");
            isTimeElapsed = true;
        }
        return { isTimeElapsed };
    };
    const clearTimer = (id) => {
        const stopBtn = document.querySelector(".stop-btn");
        stopBtn === null || stopBtn === void 0 ? void 0 : stopBtn.addEventListener("click", () => {
            var _a;
            (_a = stopBtn.firstElementChild) === null || _a === void 0 ? void 0 : _a.classList.replace("fa-pause-circle", "fa-play-circle");
            if (id) {
                clearInterval(id);
            }
        });
    };
    const armrapRoundCounter = () => {
        const countBtn = document.querySelector(".count-armrap-round");
        const roundNumberSpan = document.querySelector(".round-number");
        return countBtn.addEventListener("click", () => {
            rounds++;
            roundNumberSpan.textContent = rounds.toString();
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
        clearTimer(timerID);
    }
};
