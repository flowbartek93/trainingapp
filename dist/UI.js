"use strict";
//User Interface
//templates
const onTimeUI = document.querySelector(".on-time-template");
const tabataUI = document.querySelector(".tabata-template");
const armrapUI = document.querySelector(".armrap-template");
const selectUI = document.querySelector(".select-template");
//timer specific templates
const armrapTimer = document.querySelector(".timer-armrap-template");
const tabataTimer = document.querySelector(".timer-tabata-template");
const ontimeTimer = document.querySelector(".timer-ontime-template");
//render container
const app = document.getElementById("app");
const settings = {};
const renderContent = (el) => {
    var _a;
    const importedNode = document.importNode(el.content, true);
    const HTMLContent = importedNode.firstElementChild;
    if ((_a = app.firstElementChild) === null || _a === void 0 ? void 0 : _a.hasChildNodes()) {
        console.log("re render po cofnieciu");
        app.firstElementChild.remove();
        app.insertAdjacentElement("afterbegin", HTMLContent);
    }
    else {
        app.insertAdjacentElement("afterbegin", HTMLContent);
    }
};
const addCounterListeners = () => {
    const counters = document.querySelectorAll(".select-time-container");
    counters.forEach(counter => {
        var _a, _b, _c, _d;
        (_b = (_a = counter.lastElementChild) === null || _a === void 0 ? void 0 : _a.firstElementChild) === null || _b === void 0 ? void 0 : _b.addEventListener("click", e => {
            //MINUS
            setTimerSettings(e, "minus");
        });
        (_d = (_c = counter.lastElementChild) === null || _c === void 0 ? void 0 : _c.lastElementChild) === null || _d === void 0 ? void 0 : _d.addEventListener("click", e => {
            //PLUS
            setTimerSettings(e, "plus");
        });
    });
};
const setTimerSettings = (e, operation) => {
    var _a, _b;
    const clickedEl = e.target;
    let currentValue = parseInt((_a = clickedEl.parentElement.parentElement) === null || _a === void 0 ? void 0 : _a.children[1].textContent); // kontener gdzie ustawia się pożądany czas
    const container = (_b = clickedEl.parentElement.parentElement) === null || _b === void 0 ? void 0 : _b.children[1];
    if (operation === "plus") {
        currentValue++;
    }
    else if (operation === "minus") {
        currentValue--;
        currentValue <= 0 && (currentValue = 0);
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
};
const backToHome = () => {
    const backBtn = document.querySelector(".back-btn");
    return backBtn.addEventListener("click", () => {
        reRenderUI();
    });
};
const setTimer = (mode, settings) => {
    const startBtn = document.querySelector(".start-btn");
    startBtn.addEventListener("click", () => {
        switch (mode) {
            case "ON_TIME":
                renderContent(ontimeTimer);
                onTimeOnly(settings.durationSecs, settings.durationMinutes);
                break;
            case "TABATA":
                renderContent(tabataTimer);
                tabata(settings.durationSecs, settings.durationMinutes, settings.rest, settings.rounds);
                break;
            case "ARMRAP":
                renderContent(armrapTimer);
                armrap(settings.durationSecs, settings.durationMinutes);
                break;
        }
    });
};
const reRenderSettings = (mode, modeName) => {
    renderContent(mode);
    addCounterListeners();
    setTimer(modeName, settings);
    backToHome();
};
const reRenderUI = () => {
    renderContent(selectUI);
    const onTimeBtn = document.querySelector(".on-time");
    const tabataBtn = document.querySelector(".tabata");
    const armrapBtn = document.querySelector(".armrap");
    onTimeBtn.addEventListener("click", () => {
        const mode = "ON_TIME";
        renderContent(onTimeUI);
        backToHome();
        addCounterListeners();
        setTimer(mode, settings);
    });
    tabataBtn.addEventListener("click", () => {
        const mode = "TABATA";
        renderContent(tabataUI);
        backToHome();
        addCounterListeners();
        setTimer(mode, settings);
    });
    armrapBtn.addEventListener("click", () => {
        const mode = "ARMRAP";
        renderContent(armrapUI);
        backToHome();
        addCounterListeners();
        setTimer(mode, settings);
    });
};
document.addEventListener("DOMContentLoaded", reRenderUI);
