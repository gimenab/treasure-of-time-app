// Everything is saved in this browser only (SOW v3, C-21). No server.
const KEY = 'treasure-time:v1'

export function emptyState() {
  return {
    version: 1,
    setupDone: false,
    noticeSeen: false,
    tasks: [], // { id, title, category, minutes, custom, repeat: { type, days, date } }
    treasure: 0, // minutes earned and not yet used
    minutesLived: 0, // only grows (B-10)
    timer: null, // { minutes, endsAt, leftMs, finished, used } while taking time (B-09)
    moments: [], // { id, day, at, minutes, note, photo } registered moments, for the feed (B-10, B-11)
    pending: [], // { id, day, minutes } time used and not registered yet (row 22)
    closedCards: {}, // card id -> day it was closed (B-07)
    days: {}, // "YYYY-MM-DD" -> { done: [taskId], difficult: [{ id, title, done }], bonus }
  }
}

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return emptyState()
    return { ...emptyState(), ...JSON.parse(raw) }
  } catch {
    return emptyState()
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
    return true
  } catch {
    return false
  }
}

// Export, restore and delete (B-08, C-22). The copy is the whole state as a JSON file.
export const BACKUP_APP = 'treasure-time'

export function backupFile(state, dayKey) {
  const json = JSON.stringify({ app: BACKUP_APP, exportedOn: dayKey, state }, null, 2)
  return { name: `tu-tesoro-${dayKey}.json`, blob: new Blob([json], { type: 'application/json' }) }
}

// Returns the state inside a copy, or null if the file is not a valid copy of this app.
export function parseBackup(text) {
  try {
    const { app, state } = JSON.parse(text)
    const valid =
      app === BACKUP_APP &&
      state?.version === 1 &&
      Array.isArray(state.tasks) &&
      Number.isFinite(state.treasure) &&
      typeof state.days === 'object'
    return valid ? { ...emptyState(), ...state } : null
  } catch {
    return null
  }
}

// Safari on iPhone can clear site data after ~7 days unused; a home-screen app is exempt.
export function needsIphoneTip() {
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent)
  return ios && !window.navigator.standalone
}
