// Registering the moment (B-10, C-07). Pure functions: they take the state and return a new one.
// Only registered time counts: it goes to "minutes lived", which only grows (C-18).
import { yesterdayKey } from './day.js'

// A moment can be registered on the day it was taken or the next day (user-flow row 22).
export const stillOpen = (pending, dayKey) =>
  pending.day === dayKey || pending.day === yesterdayKey(dayKey)

export const openPending = (state, dayKey) =>
  (state.pending ?? []).filter((p) => stillOpen(p, dayKey))

const newId = () => `m-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`

// From the "time's up" screen: the timer closes and the moment is saved with its note.
export function registerFromTimer(state, dayKey, { note, photo = null }, now = Date.now()) {
  const minutes = state.timer?.used ?? 0
  if (!state.timer?.finished || minutes <= 0 || !note.trim()) return state
  const wildcard = Boolean(state.timer.wildcard)
  return addMoment({ ...state, timer: null }, { day: dayKey, minutes, note, photo, wildcard }, now)
}

// "Not now": the moment waits on the home, as a card, until the end of the next day.
export function skipFromTimer(state, dayKey) {
  const minutes = state.timer?.used ?? 0
  if (!state.timer?.finished) return state
  const next = { ...state, timer: null }
  if (minutes <= 0) return next
  const p = { id: newId(), day: dayKey, minutes, wildcard: Boolean(state.timer.wildcard) }
  return { ...next, pending: [...(state.pending ?? []), p] }
}

// Registering a moment that was left for later.
export function registerPending(state, dayKey, id, { note, photo = null }, now = Date.now()) {
  const p = openPending(state, dayKey).find((x) => x.id === id)
  if (!p || !note.trim()) return state
  const rest = state.pending.filter((x) => x.id !== id)
  const moment = { day: p.day, minutes: p.minutes, note, photo, wildcard: Boolean(p.wildcard) }
  return addMoment({ ...state, pending: rest }, moment, now)
}

// Deleting a moment that went wrong: its minutes come off "minutes lived" (founder's change,
// 2026-11-18). It corrects a mistake; the treasure is not touched.
export function deleteMoment(state, id) {
  const m = (state.moments ?? []).find((x) => x.id === id)
  if (!m) return state
  return {
    ...state,
    minutesLived: Math.max(0, state.minutesLived - m.minutes),
    moments: state.moments.filter((x) => x.id !== id),
  }
}

function addMoment(state, { day, minutes, note, photo, wildcard }, now) {
  const moment = { id: newId(), day, at: now, minutes, note: note.trim(), photo, wildcard }
  return {
    ...state,
    minutesLived: state.minutesLived + minutes,
    moments: [...(state.moments ?? []), moment],
  }
}

// A photo is accepted only if it was taken on the moment's day or today, when it is being
// registered (founder, 2026-11-19): the photo records the moment, not the past.
export const photoFitsMoment = (photoDay, momentDay, today) =>
  photoDay === momentDay || photoDay === today
