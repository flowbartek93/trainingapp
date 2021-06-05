"use strict";
//User Interface
//templates
const onTimeUI = document.querySelector(".on-time-template");
const tabataUI = document.querySelector(".tabata-template");
const armrapUI = document.querySelector(".armrap-template");
const selectUI = document.querySelector(".select-template");
const timerUI = document.querySelector(".timer-template");
//timer specific templates
const armrapTimer = document.querySelector(".timer-armrap-template");
const tabataTimer = document.querySelector(".timer-tabata-template");
const ontimeTimer = document.querySelector(".timer-ontime-template");
//render container
const app = document.getElementById("app");
const renderContent = (el, timerSpecific) => {
    var _a;
    const importedNode = document.importNode(el.content, true);
    const HTMLContent = importedNode.firstElementChild;
    if ((_a = app.firstElementChild) === null || _a === void 0 ? void 0 : _a.hasChildNodes()) {
        if (timerSpecific) {
            console.log(HTMLContent);
            return app.insertAdjacentElement("beforeend", HTMLContent);
        }
        else {
            app.firstElementChild.remove();
            return app.insertAdjacentElement("afterbegin", HTMLContent);
        }
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
const setTimer = (mode, settings) => {
    const startBtn = document.querySelector(".start-btn");
    startBtn.addEventListener("click", () => {
        renderContent(timerUI, false); //rendering timera, bez względu na mode
        switch (mode) {
            case "on_time":
                onTimeOnly(settings.durationSecs, settings.durationMinutes);
                break;
            case "tabata":
                tabata(settings.durationSecs, settings.durationMinutes, settings.rest, settings.rounds);
                break;
            case "armrap":
                renderContent(armrapTimer, true);
                armrap(settings.durationSecs, settings.durationMinutes);
                break;
        }
    });
};
const reRenderUI = () => {
    renderContent(selectUI, false);
    const onTimeBtn = document.querySelector(".on-time");
    const tabataBtn = document.querySelector(".tabata");
    const armrapBtn = document.querySelector(".armrap");
    onTimeBtn.addEventListener("click", () => {
        const mode = "on_time";
        renderContent(onTimeUI, false);
        backToHome();
        addCounterListeners();
        setTimer(mode, settings);
    });
    tabataBtn.addEventListener("click", () => {
        const mode = "tabata";
        renderContent(tabataUI, false);
        backToHome();
        addCounterListeners();
        setTimer(mode, settings);
    });
    armrapBtn.addEventListener("click", () => {
        const mode = "armrap";
        renderContent(armrapUI, false);
        backToHome();
        addCounterListeners();
        setTimer(mode, settings);
    });
};
document.addEventListener("DOMContentLoaded", reRenderUI);
