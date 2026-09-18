"use client";

import { useCallback, useSyncExternalStore } from "react";

const CHANGE_EVENT = "nettle-motion-lab:preference";

function read(key: string) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * A remembered UI preference (viewport preset, drawer state). Internal
 * convenience only; nothing in the designer's workflow depends on it, and the
 * UI never mentions where it is kept. Server-rendered with the fallback and
 * corrected after hydration without a mismatch.
 */
export function usePersisted<T extends string>(key: string, fallback: T, valid: readonly T[]): [T, (next: T) => void] {
  const subscribe = useCallback((onChange: () => void) => {
    window.addEventListener("storage", onChange);
    window.addEventListener(CHANGE_EVENT, onChange);
    return () => {
      window.removeEventListener("storage", onChange);
      window.removeEventListener(CHANGE_EVENT, onChange);
    };
  }, []);

  const raw = useSyncExternalStore(subscribe, () => read(key), () => null);
  const value = valid.includes(raw as T) ? (raw as T) : fallback;

  const set = useCallback(
    (next: T) => {
      try {
        window.localStorage.setItem(key, next);
      } catch {
        /* the preference simply does not persist */
      }
      window.dispatchEvent(new Event(CHANGE_EVENT));
    },
    [key],
  );

  return [value, set];
}
