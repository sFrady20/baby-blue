import { DependencyList, useEffect } from "react";

export function useSecond(listener: () => void, deps: DependencyList) {
  useEffect(() => {
    const timer = setInterval(() => {
      listener();
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, deps);
}
