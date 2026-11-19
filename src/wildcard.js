// Wildcard (S-01, C-06). Pure functions: they take the state and return a new one.
// 15 minutes without earning them, for a hard day. It does not expire, the user holds at most 1
// (from the first day), and the next one comes after 3 tasks marked after using it.
const MINUTE = 60_000
export const WILDCARD_MINUTES = 15
export const TASKS_FOR_NEXT = 3

// Old saved states and copies have no wildcard yet: they start with one.
export const getWildcard = (state) => state.wildcard ?? { held: true, tasksSince: 0 }

export const tasksLeft = (state) => TASKS_FOR_NEXT - getWildcard(state).tasksSince

// The treasure is not touched: these minutes were not earned.
export function startWildcard(state, now) {
  if (!getWildcard(state).held || state.timer) return state
  return {
    ...state,
    wildcard: { held: false, tasksSince: 0 },
    timer: {
      minutes: WILDCARD_MINUTES,
      endsAt: now + WILDCARD_MINUTES * MINUTE,
      leftMs: null,
      finished: false,
      used: 0,
      wildcard: true,
    },
  }
}

// Called when a task is marked (+1) or undone (-1). Counts only while there is no wildcard;
// undoing takes the task off the count (founder, 2026-11-19). Never below 0.
export function countTask(state, delta) {
  const w = getWildcard(state)
  if (w.held) return state
  const tasksSince = Math.max(0, w.tasksSince + delta)
  if (tasksSince >= TASKS_FOR_NEXT) return { ...state, wildcard: { held: true, tasksSince: 0 } }
  return { ...state, wildcard: { held: false, tasksSince } }
}
