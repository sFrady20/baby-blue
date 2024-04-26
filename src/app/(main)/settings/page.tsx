"use client";

import { Button } from "@/components/ui/button";
import { useRemote } from "@/remote.store";
import { useRouter } from "next/navigation";

export default function () {
  const remote = useRemote();

  const router = useRouter();

  return (
    <div className="container py-8 flex flex-col gap-2 flex-1">
      <Button variant={"default"} onClick={() => router.back()}>
        Back
      </Button>
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
