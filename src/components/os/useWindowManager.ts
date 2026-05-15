"use client";

import { useCallback, useState } from "react";

export type WindowId =
  | "navigation"
  | "selector"
  | "main"
  | "terminal"
  | "wallpapers"
  | "doom";
export type WindowStatus = "open" | "minimized" | "closed";

export type WindowState = {
  status: WindowStatus;
  zIndex: number;
};

type WindowRegistry = Record<WindowId, WindowState>;

const initialWindows: WindowRegistry = {
  navigation: { status: "open", zIndex: 8 },
  selector: { status: "open", zIndex: 5 },
  main: { status: "open", zIndex: 9 },
  terminal: { status: "closed", zIndex: 6 },
  wallpapers: { status: "closed", zIndex: 6 },
  doom: { status: "closed", zIndex: 6 },
};

export function useWindowManager() {
  const [state, setState] = useState({
    zCounter: 20,
    windows: initialWindows,
  });

  const openWindow = useCallback((id: WindowId) => {
    setState((current) => {
      const zIndex = current.zCounter + 1;

      return {
        zCounter: zIndex,
        windows: {
          ...current.windows,
          [id]: {
            status: "open",
            zIndex,
          },
        },
      };
    });
  }, []);

  const focusWindow = useCallback((id: WindowId) => {
    setState((current) => {
      const window = current.windows[id];

      if (!window || window.status !== "open") {
        return current;
      }

      const zIndex = current.zCounter + 1;

      return {
        zCounter: zIndex,
        windows: {
          ...current.windows,
          [id]: {
            ...window,
            zIndex,
          },
        },
      };
    });
  }, []);

  const minimizeWindow = useCallback((id: WindowId) => {
    setState((current) => ({
      ...current,
      windows: {
        ...current.windows,
        [id]: {
          ...current.windows[id],
          status: "minimized",
        },
      },
    }));
  }, []);

  const closeWindow = useCallback((id: WindowId) => {
    setState((current) => ({
      ...current,
      windows: {
        ...current.windows,
        [id]: {
          ...current.windows[id],
          status: "closed",
        },
      },
    }));
  }, []);

  return {
    windows: state.windows,
    openWindow,
    focusWindow,
    minimizeWindow,
    closeWindow,
  };
}
