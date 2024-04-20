"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useLocal } from "@/local.store";
import { useRemote } from "@/remote.store";
import { Slider, SliderRange, SliderTrack } from "@radix-ui/react-slider";
import { DateTime } from "luxon";
import { ReactNode, useEffect, useState } from "react";
import { Toggle } from "../ui/toggle";

export const DIAPER_CHECK_DRAWER_KEY = "diaperCheckDrawer";

export default function DiaperCheckDrawer(props: {}) {
  const remote = useRemote();

  const local = useLocal();
  const open = local((x) => x.isOpen[DIAPER_CHECK_DRAWER_KEY]);

  const [pee, setPee] = useState(false);
  const [poo, setPoo] = useState(false);

  return (
    <Drawer
      open={open}
      onClose={() => {
        setPee(false);
        setPoo(false);
        local.setState((x) => {
          x.isOpen[DIAPER_CHECK_DRAWER_KEY] = false;
        });
      }}
    >
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Record Diaper Check</DrawerTitle>
        </DrawerHeader>
        <div className="px-[2rem] py-6 flex flex-row">
          <Toggle
            variant={"outline"}
            className="flex-1 border-r-none rounded-r-none"
            pressed={pee}
            onPressedChange={setPee}
          >
            Wet
          </Toggle>
          <Toggle
            variant={"outline"}
            className="flex-1 rounded-l-none"
            pressed={poo}
            onPressedChange={setPoo}
          >
            Dirty
          </Toggle>
        </div>
        <DrawerFooter className="flex flex-row items-center gap-6">
          <Button
            className="flex-1"
            variant={"secondary"}
            onClick={() => {
              local.setState((x) => {
                x.isOpen[DIAPER_CHECK_DRAWER_KEY] = false;
              });
            }}
          >
            Cancel
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              //record activity
              local.setState((x) => {
                x.isOpen[DIAPER_CHECK_DRAWER_KEY] = false;
              });
              remote.setState((x) => {
                x.activity.unshift({
                  type: "check",
                  pee,
                  poo,
                  timestamp: DateTime.now().toISO(),
                });
              });
            }}
          >
            Save
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
