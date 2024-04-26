"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { liveblocks, WithLiveblocks } from "@liveblocks/zustand";
import { liveblocks as liveblocksClient } from "@/services/liveblocks";

export type RemoteState = {
  settings: {
    optimalMilk: number; //per 24 hours
    optimalSleep: number; //per 24 hours
  };
  sleep: {
    startedAt: string | null;
  };
  activity: Activity;
};
type RemoteFns = {};

type LiveblocksState = {
  liveblocks: WithLiveblocks<RemoteState & RemoteFns>["liveblocks"];
};

const typeCreator = create(
  immer<RemoteState & RemoteFns & LiveblocksState>(() => ({}) as any)
);

function makeStore(hash: string = "default"): typeof typeCreator {
  return create(
    liveblocks(
      immer<RemoteState & RemoteFns>((set, get) => ({
        settings: {
          optimalMilk: 32, //per 24 hours
          optimalSleep: 16, //per 24hours
        },
        sleep: {
          startedAt: null,
        },
        activity: [],
      })),
      {
        client: liveblocksClient,
        storageMapping: { sleep: true, activity: true },
      }
    )
  ) as any;
}

const StoreContext = createContext<ReturnType<typeof makeStore>>({} as any);

export const RemoteProvider = (props: {
  hash?: string;
  children?: ReactNode;
}) => {
  const { children, hash } = props;

  const store = useMemo(() => makeStore(hash), [hash]);

  const [enterRoom, leaveRoom] = store((x) => [
    x.liveblocks.enterRoom,
    x.liveblocks.leaveRoom,
  ]);

  useEffect(() => {
    enterRoom("bbuv");
    return () => {
      leaveRoom();
    };
  }, [enterRoom, leaveRoom]);

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

export const useRemote = () => useContext(StoreContext);
