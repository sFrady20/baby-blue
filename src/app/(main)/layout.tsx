"use client";

import DiaperCheckDrawer, {
  DIAPER_CHECK_DRAWER_KEY,
} from "@/components/diaper-check-drawer";
import { MilkBalance } from "@/components/milk-balance";
import {
  RadialFab,
  RadialFabButton,
  RadialFabIcon,
} from "@/components/radial-fab";
import RecordFeedDrawer, {
  FEED_DRAWER_KEY,
} from "@/components/record-feed-drawer";
import { SleepBalance } from "@/components/sleep-balance";
import { useLocal } from "@/local.store";
import { useRemote } from "@/remote.store";
import { cn } from "@/utils/cn";
import { DateTime } from "luxon";
import { ReactNode } from "react";

const ADD_MENU_KEY = "addMenu";

export default function (props: { children: ReactNode }) {
  const { children } = props;

  const remote = useRemote();
  const isLoading = remote((x) => x.liveblocks.isStorageLoading);
  const roomStatus = remote((x) => x.liveblocks.status);
  const isBabySleeping = remote((x) => x.sleep.startedAt !== null);

  const local = useLocal();
  const isAddMenuOpen = local((x) => x.isOpen[ADD_MENU_KEY]);

  return (
    <>
      <header>
        <div className="fixed top-0 w-full left-0 h-[150px] bg-gradient-to-b from-background via-background to-[transparent] z-[20]" />

        <div className="container py-8 fixed top-0 w-full left-0  flex flex-row items-center justify-evenly z-[30]">
          <div className="flex flex-col items-center">
            <div className="text-sm">Milk</div>
            <MilkBalance />
          </div>
          <div></div>
          <div className="flex flex-col items-center">
            <div className="text-sm">Sleep</div>
            <SleepBalance />
          </div>
        </div>
      </header>

      {children}

      <footer>
        <div className="fixed bottom-0 w-full left-0 h-[150px] bg-gradient-to-t from-background via-background to-[transparent]" />

        <div className="fixed bottom-0 w-full flex flex-col items-center justify-center py-[60px]">
          <RadialFab>
            <RadialFabButton
              onClick={() => {
                if (isLoading) return;
                local.setState((x) => {
                  x.isOpen[ADD_MENU_KEY] = !x.isOpen[ADD_MENU_KEY];
                });
              }}
            >
              {isLoading ||
              ["reconnecting", "connecting"].includes(roomStatus) ? (
                <RadialFabIcon
                  className={cn("icon-[svg-spinners--8-dots-rotate]")}
                />
              ) : (
                <RadialFabIcon
                  className={cn(
                    "icon-[mdi--plus] transition-transform rotate-0",
                    isAddMenuOpen && "rotate-[45deg]"
                  )}
                />
              )}
            </RadialFabButton>
            <RadialFabButton
              variant="sub"
              angle={180 - 50}
              radius={"6rem"}
              open={isAddMenuOpen}
              onClick={() => {
                local.setState((x) => {
                  x.isOpen[ADD_MENU_KEY] = false;
                  x.isOpen[DIAPER_CHECK_DRAWER_KEY] = true;
                });
              }}
            >
              <RadialFabIcon
                className={cn("icon-[mdi--human-baby-changing-table]")}
              />
            </RadialFabButton>
            <RadialFabButton
              variant="sub"
              angle={180}
              radius={"6rem"}
              open={isAddMenuOpen}
              onClick={() => {
                local.setState((x) => {
                  x.isOpen[ADD_MENU_KEY] = false;
                  x.isOpen[FEED_DRAWER_KEY] = true;
                });
              }}
            >
              <RadialFabIcon className={cn("icon-[mdi--baby-bottle]")} />
            </RadialFabButton>
            <RadialFabButton
              variant="sub"
              angle={180 + 50}
              radius={"6rem"}
              open={isAddMenuOpen}
              onClick={() => {
                local.setState((x) => {
                  x.isOpen[ADD_MENU_KEY] = false;
                });
                remote.setState((x) => {
                  if (x.sleep.startedAt === null) {
                    x.sleep.startedAt = DateTime.now().toISO();
                  } else {
                    const now = DateTime.now();

                    const mostRecent = x.activity.find(
                      (x) => x.type === "sleep"
                    );
                    const mostRecentTime = mostRecent
                      ? DateTime.fromISO(mostRecent.timestamp)
                      : now;
                    const mostRecentBalance =
                      (mostRecent?.type === "feed" && mostRecent.balance) ||
                      x.settings.optimalSleep;

                    const diffDays = now.diff(mostRecentTime, "days").days;

                    const amount = DateTime.now().diff(
                      DateTime.fromISO(x.sleep.startedAt),
                      "hours"
                    ).hours;

                    x.activity.unshift({
                      type: "sleep",
                      hours: amount,
                      balance:
                        mostRecentBalance -
                        diffDays * x.settings.optimalSleep +
                        amount,
                      timestamp: DateTime.now().toISO(),
                    });
                    x.sleep.startedAt = null;
                  }
                });
              }}
            >
              <RadialFabIcon
                className={cn(
                  isBabySleeping ? "icon-[mdi--sleep-off]" : "icon-[mdi--sleep]"
                )}
              />
            </RadialFabButton>
          </RadialFab>
        </div>

        {isBabySleeping ? (
          <div className="fixed bottom-0 left-0 w-full p-4 flex flex-row items-center justify-center gap-4 z-[40]">
            <div className="text-center text-sm font-medium font-italic opacity-60">
              Sshhhh... baby is sleeping.
            </div>
          </div>
        ) : null}
      </footer>

      <RecordFeedDrawer />
      <DiaperCheckDrawer />
    </>
  );
}
