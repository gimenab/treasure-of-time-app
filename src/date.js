// Local date as YYYY-MM-DD (not UTC, so midnight is the user's midnight).
export function todayKey(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

// "2026-11-16" -> "16 nov 26" (es-AR, short month and year: founder, 2026-11-19).
export function formatDate(key) {
  const [y, m, d] = key.split('-')
  return `${d} ${MONTHS[Number(m) - 1]} ${y.slice(2)}`
}
