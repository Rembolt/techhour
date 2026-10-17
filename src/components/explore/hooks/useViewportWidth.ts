"use client";

import { useSyncExternalStore } from "react";

const subscribe = (onChange: () => void) => {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
};

/** Window width in px. Cards only render on the client, so the server value is a desktop guess. */
export function useViewportWidth() {
  return useSyncExternalStore(
    subscribe,
    () => window.innerWidth,
    () => 1280,
  );
}
