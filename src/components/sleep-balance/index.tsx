"use client";

import { useRemote } from "@/remote.store";
import { useSecond } from "@/utils/use-second";
import { DateTime } from "luxon";
import { useState } from "react";

const GAUGE_RANGE = 6;

export function SleepBalance(props: {}) {
  const remote = useRemote();
  const optimalSleep = remote((x) => x.settings.optimalSleep);

  const [sleepTime, sleepBalance] = remote((x) => {
    const mostRecent = x.activity.find((x) => x.type === "sleep");
    const time = mostRecent
      ? DateTime.fromISO(mostRecent.timestamp)
      : DateTime.now();
    const balance =
      (mostRecent?.type === "sleep" && mostRecent.balance) || optimalSleep;

    return [time, balance];
  });

  const [balance, setBalance] = useState(0);
  const [value, setValue] = useState(0);

  useSecond(() => {
    const now = DateTime.now();
    const diffDays = now.diff(sleepTime, "days").days;
    const balance = sleepBalance - diffDays * optimalSleep;
    setBalance(balance);
    setValue((balance / optimalSleep - 1) * GAUGE_RANGE);
  }, [sleepTime, sleepBalance, optimalSleep]);

  return (
    <div className="flex flex-row items-center gap-2">
      <i
        className="icon-[mdi--pan-up] text-2xl text-primary"
        style={{ transform: `rotate(${value * 90}deg)` }}
      />
      <div>{`${Math.round(balance)}/${optimalSleep}`}</div>
    </div>
  );
}
