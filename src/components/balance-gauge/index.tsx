"use client";

import { useRemote } from "@/remote.store";
import { cn } from "@/utils/cn";
import { useSecond } from "@/utils/use-second";
import { DateTime } from "luxon";
import {
  ComponentPropsWithoutRef,
  ElementRef,
  ReactNode,
  forwardRef,
  useState,
} from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export const useBalance = (type: ActivityEvent["type"]) => {
  const remote = useRemote();
  const optimal = remote((x) =>
    type === "sleep"
      ? x.settings.optimalSleep
      : type === "feed"
      ? x.settings.optimalMilk
      : 10
  );

  const [mostRecentTime, mostRecentBalance] = remote((x) => {
    const mostRecent = x.activity.find((x) => x.type === type);
    const time = mostRecent
      ? DateTime.fromISO(mostRecent.timestamp)
      : DateTime.now();
    const balance =
      (mostRecent?.type === type &&
        (mostRecent as { balance: number }).balance) ||
      optimal;

    return [time, balance];
  });

  const [balance, setBalance] = useState(0);
  const [gauge, setGauge] = useState(0);

  useSecond(() => {
    const now = DateTime.now();
    const diffDays = now.diff(mostRecentTime, "days").days;
    const balance = mostRecentBalance - diffDays * optimal;
    setBalance(Math.round(balance));
    setGauge(Math.min(1, Math.max(-1, balance / optimal - 1)));
  }, [mostRecentTime, mostRecentBalance, optimal]);

  return [balance, optimal, gauge];
};

export const BalanceGauge = forwardRef<
  ElementRef<"div">,
  ComponentPropsWithoutRef<"div"> & {
    type: ActivityEvent["type"];
    color?: string;
  }
>((props, ref) => {
  const { type, color, style, className, children, ...rest } = props;

  const [balance, optimal, gauge] = useBalance(type);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          {...rest}
          className={cn("relative", className)}
          style={{
            //@ts-ignore
            [`--gauge-color`]: color || `var(--pink)`,
            ...style,
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_2063_20)">
              <foreignObject width={"100%"} height={"100%"}>
                <div
                  className="w-full h-full rounded-full border-[12px]"
                  style={{
                    backgroundOrigin: `border-box`,
                    backgroundClip: `content-box, border-box`,
                    backgroundImage: `linear-gradient(hsl(var(--background)), hsl(var(--background))), conic-gradient(hsla(var(--gauge-color) / 100%) 0deg, hsla(0 60% 60% / 0%) 90deg, hsla(var(--gauge-color) / 0%) 180deg, hsla(var(--gauge-color) / 0%) 270deg, hsla(var(--gauge-color) / 100%) 360deg)`,
                  }}
                />
              </foreignObject>
              <circle cx="40" cy="40" r="40" fill="hsl(var(--primary/20))" />
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="url(#paint0_angular_2063_20)"
                strokeWidth="8"
              />
              <path
                className="transition-transform duration-slow"
                style={{
                  transformOrigin: `40px 40px`,
                  transform: `rotate(${
                    Math.min(1, Math.max(-1, gauge)) * 90
                  }deg)`,
                }}
                d="M37.5129 2.40479C37.7828 0.040607 41.2172 0.0406106 41.4871 2.40479L42.918 14.9382C42.971 15.4022 42.8599 15.8701 42.604 16.2609L41.1731 18.4456C40.3835 19.6511 38.6165 19.6511 37.8269 18.4456L36.396 16.2609C36.1401 15.8701 36.029 15.4022 36.082 14.9382L37.5129 2.40479Z"
                fill="white"
              />
            </g>
            <defs>
              <radialGradient
                id="paint0_angular_2063_20"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(40 40) rotate(90) scale(40)"
              >
                <stop offset="0.25" stopOpacity="0" />
                <stop offset="0.50" stopColor="currentColor" stopOpacity="1" />
                <stop offset="0.75" stopColor="#CD2323" stopOpacity="0" />
              </radialGradient>
              <clipPath id="clip0_2063_20">
                <rect width="80" height="80" fill="white" />
              </clipPath>
            </defs>
          </svg>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex">
            {children}
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto backdrop-blur-lg bg-primary/20 text-primary-foreground font-medium p-2">{`${balance} / ${optimal}`}</PopoverContent>
    </Popover>
  );
});
