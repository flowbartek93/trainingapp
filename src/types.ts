//Important values;
let isCounting: boolean | null = null;
let timerID: number | NodeJS.Timeout | null;
let isPaused: boolean;

//Types
type timerData = {
  milsecs: number;
  secs: number;
  mins: number;
};

type timerSettings = {
  durationMinutes?: number;
  durationSecs?: number;
  rounds?: number;
  rest?: number;
};

const settings: timerSettings = {};

type clearTimer = (id: number | NodeJS.Timeout | null) => void;