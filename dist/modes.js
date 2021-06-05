"use strict";
//Timer modes
const onTimeOnly = (workSecs, workMins) => {
    const timeSetForMins = workMins || 0; //
    const timeSetForSecs = workSecs; //
    return timer("ON_TIME", { durationMinutes: timeSetForMins, durationSecs: timeSetForSecs }, _);
};
const tabata = (workSecs, workMins, rest, rounds) => {
    const workInSeconds = workSecs;
    const workInMinutes = workMins || 0;
    const restTime = rest || undefined;
    const roundsNumber = rounds || undefined;
    return timer("TABATA", {
        durationMinutes: workInMinutes,
        durationSecs: workInSeconds,
        rest: restTime,
        rounds: roundsNumber
    }, _);
};
const armrap = (workSecs, workMins) => {
    const timeSetForMins = workMins || 0; //
    const timeSetForSecs = workSecs; //
    return timer("ARMRAP", { durationMinutes: timeSetForMins, durationSecs: timeSetForSecs }, _);
};
