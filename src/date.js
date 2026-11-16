// Local date as YYYY-MM-DD (not UTC, so midnight is the user's midnight).
export function todayKey(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// "2026-11-16" -> "16/11/2026" (es-AR).
export function formatDate(key) {
  const [y, m, d] = key.split('-')
  return `${d}/${m}/${y}`
}
