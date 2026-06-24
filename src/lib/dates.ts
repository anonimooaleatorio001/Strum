/** YYYY-MM-DD for "today" (local time). */
export function todayKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function yesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return todayKey(d);
}

export function isYesterday(dateKey: string): boolean {
  return dateKey === yesterdayKey();
}

/** Whole-day gap between two YYYY-MM-DD keys (b - a). */
export function dayGap(a: string, b: string): number {
  if (!a || !b) return Infinity;
  const da = new Date(a + "T00:00:00");
  const db = new Date(b + "T00:00:00");
  return Math.round((db.getTime() - da.getTime()) / 86_400_000);
}
