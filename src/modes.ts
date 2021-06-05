//Timer modes

const onTimeOnly = (workSecs: number, workMins: number) => {
  const timeSetForMins = workMins || 0; //
  const timeSetForSecs = workSecs; //

  return timer("ON_TIME", { durationMinutes: timeSetForMins, durationSecs: timeSetForSecs }, _);
};

const tabata = (workSecs: number, workMins: number, rest: number, rounds: number) => {
  const workInSeconds = workSecs;
  const workInMinutes = workMins || 0;
  const restTime = rest || undefined;
  const roundsNumber = rounds || undefined;

  return timer(
    "TABATA",
    {
      durationMinutes: workInMinutes,
      durationSecs: workInSeconds,
      rest: restTime,
      rounds: roundsNumber
    },
    _
  );
};

const armrap = (workSecs: number, workMins: number) => {
  const timeSetForMins = workMins || 0; //
  const timeSetForSecs = workSecs; //

  return timer("ARMRAP", { durationMinutes: timeSetForMins, durationSecs: timeSetForSecs }, _);
};
