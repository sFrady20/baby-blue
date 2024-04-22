"use client";

import { useRemote } from "@/remote.store";
import { useSecond } from "@/utils/use-second";
import { DateTime } from "luxon";
import { useState } from "react";

const GAUGE_RANGE = 6;

export function MilkBalance(props: {}) {
  const remote = useRemote();
  const optimalMilk = remote((x) => x.settings.optimalMilk);

  const [feedTime, feedBalance] = remote((x) => {
    const mostRecentFeed = x.activity.find((x) => x.type === "feed");
    const time = mostRecentFeed
      ? DateTime.fromISO(mostRecentFeed.timestamp)
      : DateTime.now();
    const balance =
      (mostRecentFeed?.type === "feed" && mostRecentFeed.balance) ||
      optimalMilk;

    return [time, balance];
  });

  const [balance, setBalance] = useState(0);
  const [value, setValue] = useState(0);

  useSecond(() => {
    const now = DateTime.now();
    const diffDays = now.diff(feedTime, "days").days;
    const balance = feedBalance - diffDays * optimalMilk;
    setBalance(balance);
    setValue((balance / optimalMilk - 1) * GAUGE_RANGE);
  }, [feedTime, feedBalance, optimalMilk]);

  return (
    <div className="flex flex-row items-center gap-2">
      <i
        className="icon-[mdi--pan-up] text-2xl text-primary"
        style={{ transform: `rotate(${value * 90}deg)` }}
      />
      <div>{`${Math.round(balance)}/${optimalMilk}`}</div>
    </div>
  );
}
