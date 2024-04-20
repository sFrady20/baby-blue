"use client";

import { Badge } from "@/components/ui/badge";
import { useRemote } from "@/remote.store";
import { DateTime, ToRelativeOptions } from "luxon";
import { useEffect, useState } from "react";

function useTimeAgo(since: string, options?: ToRelativeOptions) {
  const [time, setTime] = useState<string | null>(
    DateTime.fromISO(since).toRelative(options)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(DateTime.fromISO(since).toRelative(options));
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [since]);

  return time;
}

function ActivityItem(props: { activity: ActivityEvent }) {
  const { activity } = props;

  const time = useTimeAgo(activity.timestamp, { style: "short" });

  switch (activity.type) {
    case "feed":
      return (
        <div className="flex flex-col p-4 border rounded-lg shadow-md bg-background w-full -scale-100">
          <div className="font-medium capitalize">{`Fed ${activity.amount.toLocaleString(
            "en-US",
            {
              maximumFractionDigits: 1,
            }
          )} oz`}</div>
          <div className="text-xs opacity-60">{time}</div>
        </div>
      );
    case "sleep":
      return (
        <div className="flex flex-col p-4 border rounded-lg shadow-md bg-background w-full -scale-100">
          <div className="font-medium capitalize">
            {`Slept for ${activity.hours.toLocaleString("en-US", {
              maximumFractionDigits: 2,
            })} Hours`}
          </div>
          <div className="text-xs opacity-60">{time}</div>
        </div>
      );
    case "check":
      return (
        <div className="flex flex-col p-4 border rounded-lg shadow-md bg-background w-full -scale-100 gap-2">
          <div className="font-medium capitalize">{`Diaper checked`}</div>
          <div className="flex flex-row items-center gap-2">
            {activity.pee && <Badge variant={"secondary"}>Wet</Badge>}
            {activity.poo && <Badge variant={"secondary"}>Dirty</Badge>}
          </div>
          <div className="text-xs opacity-60">{time}</div>
        </div>
      );
  }
}

export default function () {
  const remote = useRemote();
  const activity = remote((x) => x.activity);

  return (
    <div
      className="container h-screen overflow-y-auto -scale-100 flex flex-col gap-2 pb-[2rem] pt-[200px]"
      style={{ scrollbarColor: "tranparent", scrollbarWidth: "none" }}
    >
      {activity.map((x, i) => (
        <ActivityItem activity={x} key={i} />
      ))}
    </div>
  );
}
