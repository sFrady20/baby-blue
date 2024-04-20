"use client";

import {
  RadialFab,
  RadialFabButton,
  RadialFabIcon,
} from "@/components/radial-fab";
import RecordFeedDrawer, {
  FEED_DRAWER_KEY,
} from "@/components/record-feed-drawer";
import { Button } from "@/components/ui/button";
import { useLocal } from "@/local.store";
import { useRemote } from "@/remote.store";
import { cn } from "@/utils/cn";
import { ReactNode, useEffect } from "react";

const ADD_MENU_KEY = "addMenu";

export default function (props: { children: ReactNode }) {
  const { children } = props;

  const remote = useRemote();
  const isLoading = remote((x) => x.liveblocks.isStorageLoading);
  const roomStatus = remote((x) => x.liveblocks.status);
  const isBabySleeping = remote((x) => x.isSleeping);

  const local = useLocal();
  const isAddMenuOpen = local((x) => x.isOpen[ADD_MENU_KEY]);

  return (
    <>
      <header>
        {isBabySleeping ? (
          <div className="fixed top-0 left-0 w-full p-4 bg-secondary border-b flex flex-row items-center justify-center gap-4">
            <div className="text-center text-sm font-medium">
              Sshhhh... baby is sleeping.
            </div>
            <Button
              variant={"outline"}
              size={"sm"}
              onClick={() => {
                remote.setState((x) => {
                  x.isSleeping = !x.isSleeping;
                });
              }}
            >
              Mark as awake
            </Button>
          </div>
        ) : null}
      </header>

      <main className="flex-1 flex flex-col items-center justify-center">
        {children}
      </main>

      <footer>
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
                  x.isSleeping = !x.isSleeping;
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
      </footer>

      <RecordFeedDrawer />
    </>
  );
}
