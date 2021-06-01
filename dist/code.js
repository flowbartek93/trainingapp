"use strict";
//DOM
const milsecsContainer = document.getElementById("timer__milsecs");
const secsContainer = document.getElementById("timer__secs");
const minsContainer = document.getElementById("timer__mins");
const _ = undefined;
//Buttons
//templates
const onTimeUI = document.querySelector(".on-time-template");
const tabataUI = document.querySelector(".tabata-template");
const armrapUI = document.querySelector(".armrap-template");
const selectUI = document.querySelector(".select-template");
//render container
const app = document.getElementById("app");
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
        if (mins === settings.durationMinutes && secs === settings.durationSecs) {
            const isTimeElapsed = true;
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
        if (mins === settings.durationMinutes && secs === settings.durationSecs) {
            const isTimeElapsed = true;
            //wyzerowanie działa, teraz rest time
            resetTimer();
            startRest();
            return isTimeElapsed;
        }
    };
    if (timerMode === "ON_TIME") {
    }
    if (timerMode === "TABATA") {
        let countRounds = 0;
        return (function () {
            while (countRounds < rounds) {
                countRounds++;
                startTimer(startTabataMode);
            }
        })();
    }
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
const clearTimer = (id) => {
    if (isPaused) {
        if (id) {
            if (typeof id === "number") {
                clearInterval(id);
            }
        }
    }
    else {
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
const renderContent = (el) => {
    var _a;
    const importedNode = document.importNode(el.content, true);
    const HTMLContent = importedNode.firstElementChild;
    if ((_a = app.firstElementChild) === null || _a === void 0 ? void 0 : _a.hasChildNodes()) {
        app.firstElementChild.remove();
        return app.insertAdjacentElement("afterbegin", HTMLContent);
    }
    else {
        return app.insertAdjacentElement("afterbegin", HTMLContent);
    }
};
document.addEventListener("DOMContentLoaded", () => {
    renderContent(selectUI);
    const onTimeBtn = document.querySelector(".on-time");
    const tabataBtn = document.querySelector(".tabata");
    const armrapBtn = document.querySelector(".armrap");
    onTimeBtn.addEventListener("click", () => {
        renderContent(onTimeUI);
    });
    tabataBtn.addEventListener("click", () => {
        renderContent(tabataUI);
    });
    armrapBtn.addEventListener("click", () => {
        renderContent(armrapUI);
    });
});
