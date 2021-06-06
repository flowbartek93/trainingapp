"use strict";
const _ = undefined;
const timer = (option, settings, data) => {
    const milsecsContainer = document.getElementById("timer__milsecs");
    const secsContainer = document.getElementById("timer__secs");
    const minsContainer = document.getElementById("timer__mins");
    const resetBtn = document.querySelector(".reset-btn");
    let milsecs;
    let secs;
    let mins;
    let rounds = 1;
    let isPaused = false;
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
        return timerID;
    };
    const resetTimer = () => {
        if (isPaused) {
            resetBtn.disabled = false;
            resetBtn === null || resetBtn === void 0 ? void 0 : resetBtn.addEventListener("click", () => {
                milsecsContainer.textContent = "00";
                secsContainer.textContent = "00";
                minsContainer.textContent = "00";
                milsecs = 0;
                secs = 0;
                mins = 0;
                console.log("resetuje");
            });
        }
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
        const title = document.querySelector(".rest-time");
        title.style.display = "block";
        startTimer(() => {
            if (secs === (settings === null || settings === void 0 ? void 0 : settings.rest)) {
                isTimeElapsed = true;
                resetTimer();
                RoundCounter("tabata"); // automatyczne zliczenie rundy
                startTimer(startTabataMode);
                title.style.display = "none";
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
                rounds++;
                startRest();
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
    const stopTimer = () => {
        const stopBtn = document.querySelector(".stop-btn");
        let id;
        stopBtn === null || stopBtn === void 0 ? void 0 : stopBtn.addEventListener("click", () => {
            if (stopBtn.classList.contains("active")) {
                //continue timing
                stopBtn.classList.remove("active");
                stopBtn.textContent = "stop !";
                isPaused = false;
                resetBtn.disabled = true;
                id = startTimer(startArmrap);
            }
            else {
                //pauza
                stopBtn.classList.add("active");
                stopBtn.textContent = "go !";
                isPaused = true;
                resetTimer();
                if (id) {
                    clearInterval(id);
                }
                else {
                    clearInterval(timerID);
                }
            }
        });
    };
    const RoundCounter = (mode) => {
        const roundNumberSpan = document.querySelector(".round-number");
        const roundNumberTotal = document.querySelector(".round-number-total");
        if (mode === "armrap") {
            const countBtn = document.querySelector(".count-armrap-round");
            return countBtn.addEventListener("click", () => {
                rounds++;
                roundNumberSpan.textContent = rounds.toString();
            });
        }
        if (mode === "tabata") {
            if (rounds === (settings === null || settings === void 0 ? void 0 : settings.rounds)) {
                roundNumberSpan.style.color = "brown";
            }
            roundNumberSpan.textContent = rounds.toString();
            roundNumberTotal.textContent = settings.rounds.toString();
        }
    };
    if (timerModeName === "ON_TIME") {
        startTimer(startOnTimeMode);
        stopTimer();
    }
    if (timerModeName === "TABATA") {
        //tu trzeba naprawić liczenie rund
        startTimer(startTabataMode);
        RoundCounter("tabata");
        stopTimer();
    }
    if (timerModeName === "ARMRAP") {
        rounds = 0;
        startTimer(startArmrap);
        RoundCounter("armrap"); // nasłuchiwanie na button
        stopTimer();
    }
};
