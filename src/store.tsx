"use client";

import { ReactNode, createContext, useContext, useMemo } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export type AppState = {
  isLoading?: boolean;
};

const defaultAppState: AppState = {
  isLoading: true,
};

function makeStore(hash: string = "default") {
  return create(
    immer(
      persist<AppState>((set, get) => defaultAppState, {
        name: `bb-${hash}`,
      })
    )
  );
}

const StoreContext = createContext<ReturnType<typeof makeStore>>({} as any);

export const StoreProvider = (props: {
  hash?: string;
  children?: ReactNode;
}) => {
  const { children, hash } = props;
  const state = useMemo(() => makeStore(hash), [hash]);
  return (
    <StoreContext.Provider value={state}>{children}</StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
