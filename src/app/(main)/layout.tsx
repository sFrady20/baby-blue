"use client";

import {
  RadialFab,
  RadialFabButton,
  RadialFabIcon,
} from "@/components/radial-fab";
import RecordFeedDrawer, {
  FEED_DRAWER_KEY,
} from "@/components/record-feed-drawer";
import { useLocal } from "@/local.store";
import { useRemote } from "@/remote.store";
import { cn } from "@/utils/cn";
import { ReactNode } from "react";

const ADD_MENU_KEY = "addMenu";

export default function (props: { children: ReactNode }) {
  const { children } = props;

  const remote = useRemote();
  const isLoading = remote((x) => x.isLoading);
  const isBabySleeping = remote((x) => x.isBabySleeping);

  const local = useLocal();
  const isAddMenuOpen = local((x) => x.isOpen[ADD_MENU_KEY]);

  return (
    <>
      <header>
        {isBabySleeping ? (
          <div className="fixed top-0 left-0 w-full p-4 bg-secondary text-center text-sm font-medium border-b">
            Sshhhh... baby is sleeping.
          </div>
        ) : null}
      </header>
      <main className="flex-1 flex flex-col">{children}</main>
      <footer>
        <div className="flex flex-col items-center justify-center py-[60px]">
          <RadialFab>
            <RadialFabButton
              onClick={() => {
                if (isLoading) return;
                local.setState((x) => {
                  x.isOpen[ADD_MENU_KEY] = !x.isOpen[ADD_MENU_KEY];
                });
              }}
            >
              {isLoading ? (
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
                  x.isBabySleeping = !isBabySleeping;
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