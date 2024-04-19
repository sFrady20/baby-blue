"use client";

import { ReactNode, createContext, useContext, useMemo } from "react";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export type LocalState = {
  isOpen: { [key: string]: boolean };
};

function makeStore(hash: string = "default") {
  return create(
    immer<LocalState>((set, get) => ({
      isOpen: {},
    }))
  );
}

const StoreContext = createContext<ReturnType<typeof makeStore>>({} as any);

export const LocalProvider = (props: {
  hash?: string;
  children?: ReactNode;
}) => {
  const { children, hash } = props;
  const state = useMemo(() => makeStore(hash), [hash]);
  return (
    <StoreContext.Provider value={state}>{children}</StoreContext.Provider>
  );
};

export const useLocal = () => useContext(StoreContext);
