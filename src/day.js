// Daily list rules (B-04 to B-06). Pure functions: they take the state and return a new one.
import { todayKey } from './date.js'
import { countTask } from './wildcard.js'

export const DIFFICULT_MINUTES = 10 // C-17, scale 2 (was 20)
export const DAY_BONUS = 5 // C-17, scale 2 (was 10)

const weekday = (key) => new Date(`${key}T12:00:00`).getDay()

export function yesterdayKey(key) {
  const d = new Date(`${key}T12:00:00`)
  d.setDate(d.getDate() - 1)
  return todayKey(d)
}

// Routine tasks scheduled for a given day (B-04).
export function scheduledTasks(tasks, key) {
  return tasks.filter(({ repeat }) => {
    if (repeat.type === 'daily') return true
    if (repeat.type === 'days') return repeat.days.includes(weekday(key))
    return repeat.date === key
  })
}

export function emptyDay() {
  return { done: [], difficult: [], bonus: false }
}

export const getDay = (state, key) => state.days?.[key] ?? emptyDay()

const withDay = (state, key, day) => ({ ...state, days: { ...state.days, [key]: day } })

// The bonus counts every routine task scheduled today plus every difficult task (C-17, row 10).
function allDone(state, key, day) {
  const routine = scheduledTasks(state.tasks, key)
  const total = routine.length + day.difficult.length
  return (
    total > 0 &&
    routine.every((t) => day.done.includes(t.id)) &&
    day.difficult.every((d) => d.done)
  )
}

// Adds or takes back the bonus so it always matches the list. Never below 0 (row 9).
function settleBonus(state, key, day) {
  const complete = allDone(state, key, day)
  if (complete && !day.bonus) {
    return { ...withDay(state, key, { ...day, bonus: true }), treasure: state.treasure + DAY_BONUS }
  }
  if (!complete && day.bonus) {
    return {
      ...withDay(state, key, { ...day, bonus: false }),
      treasure: Math.max(0, state.treasure - DAY_BONUS),
    }
  }
  return withDay(state, key, day)
}

// Mark or undo a routine task (B-05). Undo only exists for the same day, never below 0.
export function toggleTask(state, key, taskId) {
  const task = state.tasks.find((t) => t.id === taskId)
  const day = getDay(state, key)
  const marked = day.done.includes(taskId)
  const next = countTask(
    {
      ...state,
      treasure: marked ? Math.max(0, state.treasure - task.minutes) : state.treasure + task.minutes,
    },
    marked ? -1 : 1,
  )
  const done = marked ? day.done.filter((id) => id !== taskId) : [...day.done, taskId]
  return settleBonus(next, key, { ...day, done })
}

// Difficult task (B-06): written in the user's own words, +20, more than one allowed.
export function addDifficult(state, key, title) {
  const day = getDay(state, key)
  const item = { id: `difficult-${Date.now()}`, title: title.trim(), done: false }
  return settleBonus(state, key, { ...day, difficult: [...day.difficult, item] })
}

export function toggleDifficult(state, key, id) {
  const day = getDay(state, key)
  const item = day.difficult.find((d) => d.id === id)
  const treasure = item.done
    ? Math.max(0, state.treasure - DIFFICULT_MINUTES)
    : state.treasure + DIFFICULT_MINUTES
  const difficult = day.difficult.map((d) => (d.id === id ? { ...d, done: !d.done } : d))
  return settleBonus(countTask({ ...state, treasure }, item.done ? -1 : 1), key, { ...day, difficult })
}

// An unmarked difficult task can be removed the same day (it was never earned).
export function removeDifficult(state, key, id) {
  const day = getDay(state, key)
  const difficult = day.difficult.filter((d) => d.id !== id || d.done)
  return settleBonus(state, key, { ...day, difficult })
}

// "Yesterday: X · add again" (row 5). Unfinished difficult tasks from yesterday that are not
// already on today's list. If ignored, they simply stop showing the day after.
export function yesterdaySuggestions(state, key) {
  const today = getDay(state, key).difficult.map((d) => d.title)
  return getDay(state, yesterdayKey(key)).difficult.filter(
    (d) => !d.done && !today.includes(d.title),
  )
}
