"use strict";
//DOM
const _ = undefined;
//Buttons
//templates
const onTimeUI = document.querySelector(".on-time-template");
const tabataUI = document.querySelector(".tabata-template");
const armrapUI = document.querySelector(".armrap-template");
const selectUI = document.querySelector(".select-template");
const timerUI = document.querySelector(".timer-template");
//render container
const app = document.getElementById("app");
//Important values;
let isCounting = null;
let timerID;
let isPaused;
const settings = {};
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
const onTimeOnly = (workSecs, workMins) => {
    const timeSetForMins = workMins || 0; //
    const timeSetForSecs = workSecs; //
    return timer("ON_TIME", { durationMinutes: timeSetForMins, durationSecs: timeSetForSecs }, _);
};
const tabata = (workSeconds, workMinutes, rest, rounds) => {
    const workInSeconds = workSeconds;
    const workInMinutes = workMinutes || 0;
    const restTime = rest || undefined;
    const roundsNumber = rounds || undefined;
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
const addCounterListeners = () => {
    const counters = document.querySelectorAll(".select-time-container");
    counters.forEach(counter => {
        var _a, _b, _c, _d;
        (_b = (_a = counter.lastElementChild) === null || _a === void 0 ? void 0 : _a.firstElementChild) === null || _b === void 0 ? void 0 : _b.addEventListener("click", e => {
            //MINUS
            countSettings(e, "minus");
        });
        (_d = (_c = counter.lastElementChild) === null || _c === void 0 ? void 0 : _c.lastElementChild) === null || _d === void 0 ? void 0 : _d.addEventListener("click", e => {
            //PLUS
            countSettings(e, "plus");
        });
    });
};
const countSettings = (e, operation) => {
    var _a, _b;
    const clickedEl = e.target;
    let currentValue = parseInt((_a = clickedEl.parentElement.parentElement) === null || _a === void 0 ? void 0 : _a.children[1].textContent); // kontener gdzie ustawia się pożądany czas
    const container = (_b = clickedEl.parentElement.parentElement) === null || _b === void 0 ? void 0 : _b.children[1];
    currentValue <= 0 && (currentValue = 0);
    if (operation === "plus") {
        currentValue++;
    }
    else if (operation === "minus") {
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
    const backBtn = document.querySelector(".back-btn");
    return backBtn.addEventListener("click", () => {
        reRenderUI();
    });
};
const runTimerBtn = (mode, settings) => {
    const startBtn = document.querySelector(".start-btn");
    startBtn.addEventListener("click", () => {
        renderContent(timerUI);
        switch (mode) {
            case "on_time":
                onTimeOnly(settings.durationSecs, settings.durationMinutes);
                break;
            case "tabata":
                tabata(settings.durationSecs, settings.durationMinutes, settings.rest, settings.rounds);
                break;
            case "armrap":
                break;
        }
    });
};
const reRenderUI = () => {
    renderContent(selectUI);
    const onTimeBtn = document.querySelector(".on-time");
    const tabataBtn = document.querySelector(".tabata");
    const armrapBtn = document.querySelector(".armrap");
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
