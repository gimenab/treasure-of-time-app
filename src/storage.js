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

// Safari on iPhone can clear site data after ~7 days unused; a home-screen app is exempt.
export function needsIphoneTip() {
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent)
  return ios && !window.navigator.standalone
}
