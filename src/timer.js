// Taking time (B-09, C-08). Pure functions: they take the state and the current time (ms).
// The timer runs on real time, so it keeps counting with the app closed and stops on its own.
const MINUTE = 60_000

// Minutes that can be taken: never more than the balance (founder, 2026-11-17).
export const maxMinutes = (state) => state.treasure

// The minutes come out of the balance when the timer starts.
export function startTimer(state, minutes, now) {
  const m = Math.min(Math.floor(minutes), maxMinutes(state))
  if (!(m > 0) || state.timer) return state
  return {
    ...state,
    treasure: state.treasure - m,
    timer: { minutes: m, endsAt: now + m * MINUTE, leftMs: null, finished: false, used: 0 },
  }
}

export function leftMs(timer, now) {
  if (timer.finished) return 0
  if (timer.leftMs !== null) return timer.leftMs
  return Math.max(0, timer.endsAt - now)
}

// Pausing has no consequence (row 13).
export function pauseTimer(state, now) {
  const { timer } = state
  if (!timer || timer.finished || timer.leftMs !== null) return state
  return { ...state, timer: { ...timer, leftMs: leftMs(timer, now), endsAt: null } }
}

export function resumeTimer(state, now) {
  const { timer } = state
  if (!timer || timer.finished || timer.leftMs === null) return state
  return { ...state, timer: { ...timer, endsAt: now + timer.leftMs, leftMs: null } }
}

// Stops on its own when the time runs out (row 26).
export function settleTimer(state, now) {
  const { timer } = state
  if (!timer || timer.finished || leftMs(timer, now) > 0) return state
  return { ...state, timer: { ...timer, finished: true, used: timer.minutes, endsAt: null, leftMs: 0 } }
}

// Whole minutes not used yet; what can go back to the balance when stopping early (row 14).
export const unusedMinutes = (timer, now) => Math.round(leftMs(timer, now) / MINUTE)

export function stopTimer(state, now, save) {
  const { timer } = state
  if (!timer || timer.finished) return state
  const unused = Math.min(unusedMinutes(timer, now), timer.minutes)
  // Wildcard minutes were not earned: what is left of them is lost, not saved (S-01).
  const back = save && !timer.wildcard ? unused : 0
  const used = timer.wildcard ? timer.minutes - unused : timer.minutes - back
  return {
    ...state,
    treasure: state.treasure + back,
    timer: { ...timer, finished: true, used, endsAt: null, leftMs: 0 },
  }
}

// Leaves the "time's up" screen. B-10 will register the moment here.
export const closeTimer = (state) => ({ ...state, timer: null })
