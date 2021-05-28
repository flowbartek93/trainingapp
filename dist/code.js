"use strict";
//DOM
const milsecsContainer = document.getElementById("timer__milsecs");
const secsContainer = document.getElementById("timer__secs");
const minsContainer = document.getElementById("timer__mins");
//Buttons
const startBtn = document.querySelector(".startBtn");
const stopBtn = document.querySelector(".stopBtn");
let isCounting = null;
let timerID;
const timer = (settings, data) => {
    let milsecs;
    let secs;
    let mins;
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
        }
        else if (milsecs < 100) {
            milsecs++; // counting from milsecs
        }
        if (secs >= 60) {
            secs = 0;
            mins++;
        }
        milsecsContainer.textContent = milsecs === 1 && secs > 1 ? "00" : milsecs.toString();
        secsContainer.textContent = secs < 10 ? "0" + secs.toString() : secs.toString();
        minsContainer.textContent = mins < 10 ? "0" + mins.toString() : mins.toString();
    }, 1);
    return { startCount, milsecs, secs, mins };
};
document.addEventListener("DOMContentLoaded", () => {
    startBtn.addEventListener("click", (e) => {
        const button = e.target;
        if (button.classList.contains("active")) {
            button.classList.remove("active");
            startBtn.textContent = "Start";
            if (timerID) {
                if (typeof timerID === "number") {
                    clearInterval(timerID);
                }
            }
        }
        else {
            button.classList.add("active");
            startBtn.textContent = "Pause";
            const { startCount, milsecs, secs, mins } = timer();
            timerID = startCount;
            console.log("start");
        }
    });
});
// timer({ durationSecs: 10 });
