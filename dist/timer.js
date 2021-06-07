"use strict";
const _ = undefined;
const timer = (option, settings, data) => {
    //Spans that views timer iterations
    const milsecsContainer = document.getElementById("timer__milsecs");
    const secsContainer = document.getElementById("timer__secs");
    const minsContainer = document.getElementById("timer__mins");
    //Timer Buttons
    const resetBtn = document.querySelector(".reset-btn");
    const backBtn = document.querySelector(".back-menu");
    const stopBtn = document.querySelector(".stop-btn");
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
                RoundCounter(); // automatyczne zliczenie rundy
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
    //EVENTS TAKING PLACE WHEN TIMER IS RUNNING
    const eventListeners = (UIPart, mode) => {
        //Reset Buttons
        resetBtn === null || resetBtn === void 0 ? void 0 : resetBtn.addEventListener("click", () => {
            resetTimer();
        });
        //back to settings of particular timer
        backBtn.addEventListener("click", () => {
            backToSettings(UIPart);
        });
        //stop timer btn
        stopBtn === null || stopBtn === void 0 ? void 0 : stopBtn.addEventListener("click", () => {
            stopTimer(mode);
        });
        //count rounds when in armrap mode
        if (UIPart === armrapUI) {
            const countBtn = document.querySelector(".count-armrap-round");
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
    const backToSettings = (mode) => {
        resetTimer();
        reRenderSettings(mode, timerModeName);
    };
    const stopTimer = (mode) => {
        if (stopBtn.classList.contains("active")) {
            //continue timing
            stopBtn.classList.remove("active");
            stopBtn.textContent = "stop !";
            isPaused = false;
            resetBtn.disabled = true;
            startTimer(mode);
        }
        else {
            //pauza
            stopBtn.classList.add("active");
            stopBtn.textContent = "go !";
            isPaused = true;
            resetBtn.disabled = false;
            clearInterval(timerID);
        }
    };
    const RoundCounter = () => {
        const roundNumberSpan = document.querySelector(".round-number");
        const roundNumberTotal = document.querySelector(".round-number-total");
        if (timerModeName === "ARMRAP") {
            rounds++;
            roundNumberSpan.textContent = rounds.toString();
        }
        if (timerModeName === "TABATA") {
            if (rounds === (settings === null || settings === void 0 ? void 0 : settings.rounds)) {
                roundNumberSpan.style.color = "brown";
            }
            roundNumberSpan.textContent = rounds.toString();
            roundNumberTotal.textContent = settings.rounds.toString();
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
