"use client";

import DiaperCheckDrawer, {
  DIAPER_CHECK_DRAWER_KEY,
} from "@/components/diaper-check-drawer";
import {
  RadialFab,
  RadialFabButton,
  RadialFabIcon,
} from "@/components/radial-fab";
import RecordFeedDrawer, {
  FEED_DRAWER_KEY,
} from "@/components/record-feed-drawer";
import { BalanceGauge } from "@/components/balance-gauge";
import { useLocal } from "@/local.store";
import { useRemote } from "@/remote.store";
import { cn } from "@/utils/cn";
import { DateTime } from "luxon";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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

        <div className="py-4 fixed top-0 w-full left-0 z-[30]">
          <div className="container flex flex-row items-center justify-evenly">
            <div className="flex flex-col items-center flex-1">
              <BalanceGauge
                type="milk"
                color="var(--green)"
                className="w-[56px]"
              >
                <i className="text-primary-foreground icon-[mdi--baby-bottle]" />
              </BalanceGauge>
            </div>
            <div className="flex flex-col items-center flex-1">
              <BalanceGauge
                type="sleep"
                color="var(--purple)"
                className="w-[56px]"
              >
                <i className="text-primary-foreground icon-[mdi--sleep]" />
              </BalanceGauge>
            </div>
          </div>
        </div>
      </header>

      {children}

      <footer>
        <div className="fixed bottom-0 w-full left-0 h-[150px] bg-gradient-to-t from-background via-background to-[transparent]" />

        <div className="fixed bottom-0 w-full flex flex-row items-center justify-center py-[60px] gap-10">
          <div className="w-10"></div>

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
                    const amount = DateTime.now().diff(
                      DateTime.fromISO(x.sleep.startedAt),
                      "hours"
                    ).hours;

                    x.activity.unshift({
                      type: "sleep",
                      hours: amount,
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

          <Button variant={"secondary"} size={"icon"} asChild>
            <Link href={"/settings"}>
              <i className="icon-[mdi--cog]" />
            </Link>
          </Button>
        </div>

        {isBabySleeping ? (
          <div className="fixed bottom-0 left-0 w-full p-4 flex flex-row items-center justify-center gap-4 z-[40]">
            <div className="text-center text-sm font-medium font-italic opacity-60">
              Sshhhh... Violet is sleeping.
            </div>
          </div>
        ) : null}
      </footer>

      <RecordFeedDrawer />
      <DiaperCheckDrawer />
    </>
  );
}
