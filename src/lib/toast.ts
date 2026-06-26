// Tiny dependency-free toast bus. `toast(message, type)` can be called from any
// client component; the <Toaster/> mounted in the root layout renders them.

export type ToastType = "info" | "success" | "error";

export interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

let listeners: ((t: ToastItem) => void)[] = [];
let counter = 0;

export function toast(message: string, type: ToastType = "info") {
  const item: ToastItem = { id: ++counter, message, type };
  listeners.forEach((l) => l(item));
}

export function subscribeToasts(fn: (t: ToastItem) => void) {
  listeners.push(fn);
  return () => {
    listeners = listeners.filter((l) => l !== fn);
  };
}
