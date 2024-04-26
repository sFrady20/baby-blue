"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRemote } from "@/remote.store";
import { useRouter } from "next/navigation";

export default function () {
  const router = useRouter();

  const remote = useRemote();

  const optimalMilk = remote((x) => x.settings.optimalMilk);
  const optimalSleep = remote((x) => x.settings.optimalSleep);

  return (
    <div className="container py-8 flex flex-col gap-2 flex-1">
      <Button variant={"default"} onClick={() => router.back()}>
        Back
      </Button>

      <div className="flex flex-row items-center">
        <div className="flex-1">Optimal Milk Balance</div>
        <div className="flex flex-row items-center gap-2">
          <Button
            variant={"secondary"}
            size={"icon"}
            onClick={() => {
              remote.setState((x) => {
                x.settings.optimalMilk -= 1;
              });
            }}
          >
            -
          </Button>
          <div className="h-10 px-4 border rounded-md flex flex-row items-center bg-secondary text-secondary-foreground">
            {optimalMilk}
          </div>
          <Button
            variant={"secondary"}
            size={"icon"}
            onClick={() => {
              remote.setState((x) => {
                x.settings.optimalMilk += 1;
              });
            }}
          >
            +
          </Button>
        </div>
      </div>

      <div className="flex flex-row items-center">
        <div className="flex-1">Optimal Sleep Balance</div>
        <div className="flex flex-row items-center gap-2">
          <Button
            variant={"secondary"}
            size={"icon"}
            onClick={() => {
              remote.setState((x) => {
                x.settings.optimalSleep -= 1;
              });
            }}
          >
            -
          </Button>
          <div className="h-10 px-4 border rounded-md flex flex-row items-center bg-secondary text-secondary-foreground">
            {optimalSleep}
          </div>
          <Button
            variant={"secondary"}
            size={"icon"}
            onClick={() => {
              remote.setState((x) => {
                x.settings.optimalSleep += 1;
              });
            }}
          >
            +
          </Button>
        </div>
      </div>

      <Button
        variant={"destructive"}
        onClick={() => {
          if (window.confirm("Are you sure you want to delete all history?"))
            remote.setState((x) => {
              x.activity = [];
            });
        }}
      >
        Clear History
      </Button>
    </div>
  );
}
