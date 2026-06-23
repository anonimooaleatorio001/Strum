import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { isYesterday, todayKey, useLocalStorage } from "../lib/storage";

export const DAILY_GOAL_XP = 40;

interface ProgressState {
  xp: number;
  streak: number;
  lastActive: string;
  completedLessons: string[];
  dailyXp: number;
  dailyDate: string;
}

interface ProgressContextValue extends ProgressState {
  dailyGoal: number;
  addXp: (amount: number) => void;
  completeLesson: (id: string, xp: number) => void;
  isLessonComplete: (id: string) => boolean;
  reset: () => void;
}

const defaultState: ProgressState = {
  xp: 0,
  streak: 0,
  lastActive: "",
  completedLessons: [],
  dailyXp: 0,
  dailyDate: todayKey(),
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useLocalStorage<ProgressState>(
    "strum.progress.v1",
    defaultState
  );

  const addXp = useCallback(
    (amount: number) => {
      setState((prev) => {
        const today = todayKey();
        let streak = prev.streak;
        if (prev.lastActive !== today) {
          streak = isYesterday(prev.lastActive) ? prev.streak + 1 : 1;
        }
        const sameDay = prev.dailyDate === today;
        return {
          ...prev,
          xp: prev.xp + amount,
          streak,
          lastActive: today,
          dailyDate: today,
          dailyXp: (sameDay ? prev.dailyXp : 0) + amount,
        };
      });
    },
    [setState]
  );

  const completeLesson = useCallback(
    (id: string, xp: number) => {
      setState((prev) => {
        const today = todayKey();
        const already = prev.completedLessons.includes(id);
        let streak = prev.streak;
        if (prev.lastActive !== today) {
          streak = isYesterday(prev.lastActive) ? prev.streak + 1 : 1;
        }
        const sameDay = prev.dailyDate === today;
        return {
          ...prev,
          xp: prev.xp + xp,
          streak,
          lastActive: today,
          dailyDate: today,
          dailyXp: (sameDay ? prev.dailyXp : 0) + xp,
          completedLessons: already
            ? prev.completedLessons
            : [...prev.completedLessons, id],
        };
      });
    },
    [setState]
  );

  const isLessonComplete = useCallback(
    (id: string) => state.completedLessons.includes(id),
    [state.completedLessons]
  );

  const reset = useCallback(
    () => setState({ ...defaultState, dailyDate: todayKey() }),
    [setState]
  );

  const value = useMemo<ProgressContextValue>(
    () => ({
      ...state,
      dailyGoal: DAILY_GOAL_XP,
      addXp,
      completeLesson,
      isLessonComplete,
      reset,
    }),
    [state, addXp, completeLesson, isLessonComplete, reset]
  );

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider");
  return ctx;
}
