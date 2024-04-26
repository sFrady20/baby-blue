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
import { useState } from "react";

export const FEED_DRAWER_KEY = "feedDrawer";

export default function RecordFeedDrawer(props: {}) {
  const remote = useRemote();

  const local = useLocal();
  const isFeedDrawerOpen = local((x) => x.isOpen[FEED_DRAWER_KEY]);

  const [amount, setAmount] = useState([5]);

  return (
    <Drawer
      open={isFeedDrawerOpen}
      onClose={() => {
        setAmount([0]);
        local.setState((x) => {
          x.isOpen[FEED_DRAWER_KEY] = false;
        });
      }}
    >
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Record Feeding</DrawerTitle>
        </DrawerHeader>
        <div className="px-[2rem] py-6">
          <div className="text-center font-medium text-sm pb-2">
            {amount[0].toLocaleString("en-US", { maximumFractionDigits: 1 })} oz
          </div>
          <Slider
            max={10}
            min={0}
            step={0.01}
            value={amount}
            onValueChange={setAmount}
            className="relative flex w-full touch-none select-none items-center"
          >
            <SliderTrack className="relative h-10 w-full grow overflow-hidden rounded-full bg-primary/10">
              <SliderRange className="absolute bg-primary h-full" />
            </SliderTrack>
          </Slider>
        </div>
        <DrawerFooter className="flex flex-row items-center gap-6">
          <Button
            className="flex-1"
            variant={"secondary"}
            onClick={() => {
              local.setState((x) => {
                x.isOpen[FEED_DRAWER_KEY] = false;
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
                x.isOpen[FEED_DRAWER_KEY] = false;
              });
              remote.setState((x) => {
                x.activity.unshift({
                  type: "milk",
                  amount: amount[0],
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
