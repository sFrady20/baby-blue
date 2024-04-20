"use client";

import { useRemote } from "@/remote.store";
import { DateTime } from "luxon";

export default function () {
  const remote = useRemote();
  const activity = remote((x) => x.activity);

  return (
    <div className="px-[2rem] flex-1 flex flex-col items-center justify-end pt-[200px] gap-4 w-full -scale-100 overflow-y-auto">
      {activity.map((x, i) => (
        <div
          key={i}
          className="flex flex-row items-center justify-between p-4 border rounded-lg shadow-md bg-background w-full -scale-100"
        >
          <div>{x.type}</div>
          <div>
            {DateTime.fromISO(x.timestamp).toRelative({ style: "short" })}
          </div>
        </div>
      ))}
    </div>
  );
}
