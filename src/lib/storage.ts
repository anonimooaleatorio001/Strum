import { useCallback, useEffect, useState } from "react";

/** A localStorage-backed state hook that survives reloads. */
export function useLocalStorage<T>(
  key: string,
  initial: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage might be unavailable (private mode) — fail silently */
    }
  }, [key, value]);

  const set = useCallback(
    (next: T | ((prev: T) => T)) => setValue(next),
    []
  );

  return [value, set];
}

/** YYYY-MM-DD for "today", used for streak bookkeeping. */
export function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function isYesterday(dateKey: string): boolean {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10) === dateKey;
}
