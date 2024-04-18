"use client";

import { ReactNode, createContext, useContext, useMemo } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { readRemoteState } from "./actions/read-remote-state";
import { updateRemoteState } from "./actions/update-remote-state";
import { destroyRemoteState } from "./actions/destroy-remote-state";

export type RemoteState = {
  isLoading?: boolean;
  isBabySleeping?: boolean;
};

function makeStore(hash: string = "default") {
  return create(
    immer(
      persist<RemoteState>(
        (set, get) => ({
          isLoading: true,
        }),
        {
          name: `bb-${hash}`,
          storage: {
            getItem: async (name) => ({
              state: {
                ...(await readRemoteState(name)),
                isLoading: false,
              } as RemoteState,
            }),
            setItem: async (name, { state }) => {
              delete state.isLoading;
              await updateRemoteState(name, state);
            },
            removeItem: async (name) => {
              await destroyRemoteState(name);
            },
          },
        }
      )
    )
  );
}

const StoreContext = createContext<ReturnType<typeof makeStore>>({} as any);

export const RemoteProvider = (props: {
  hash?: string;
  children?: ReactNode;
}) => {
  const { children, hash } = props;
  const state = useMemo(() => makeStore(hash), [hash]);
  return (
    <StoreContext.Provider value={state}>{children}</StoreContext.Provider>
  );
};

export const useRemote = () => useContext(StoreContext);
