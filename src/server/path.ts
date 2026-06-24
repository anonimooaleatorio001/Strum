import "server-only";
import type { User } from "@prisma/client";
import {
  buildCurriculum,
  orderedExercises,
  type Unit,
} from "@/lib/curriculum";
import { getCrownsByExercise } from "@/server/progress";

export interface ExerciseStatus {
  crown: number; // 0..5, best passed crown
  unlocked: boolean;
}

export interface PathState {
  units: Unit[];
  statusById: Record<string, ExerciseStatus>;
  currentId: string | null;
  totalExercises: number;
  doneCount: number;
}

/** Compute the full path state (locks, crowns, current lesson) for a user. */
export async function getPathState(user: User): Promise<PathState> {
  const instrument = user.instrument;
  const numStrings = user.numStrings;

  const units = buildCurriculum(instrument, numStrings);
  const ordered = orderedExercises(instrument, numStrings);
  const crowns = await getCrownsByExercise(user.id);

  const statusById: Record<string, ExerciseStatus> = {};
  let currentId: string | null = null;
  let doneCount = 0;

  ordered.forEach((o, i) => {
    const crown = crowns[o.exercise.id] ?? 0;
    const prevId = i === 0 ? null : ordered[i - 1].exercise.id;
    const prevDone = prevId === null || (crowns[prevId] ?? 0) > 0;
    const unlocked = prevDone;
    statusById[o.exercise.id] = { crown, unlocked };
    if (crown > 0) doneCount += 1;
    if (currentId === null && unlocked && crown === 0) {
      currentId = o.exercise.id;
    }
  });

  return {
    units,
    statusById,
    currentId,
    totalExercises: ordered.length,
    doneCount,
  };
}

/** The next exercise the user should do ("lição de hoje"). */
export async function getTodaysExerciseId(user: User): Promise<string | null> {
  const { currentId } = await getPathState(user);
  return currentId;
}
