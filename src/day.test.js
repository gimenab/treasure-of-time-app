import { describe, expect, it } from 'vitest'
import {
  DAY_BONUS,
  DIFFICULT_MINUTES,
  addDifficult,
  getDay,
  removeDifficult,
  scheduledTasks,
  toggleDifficult,
  toggleTask,
  yesterdaySuggestions,
} from './day.js'
import { emptyState } from './storage.js'

const MON = '2026-11-16'
const TUE = '2026-11-17'

const tasks = [
  { id: 'water', minutes: 2, repeat: { type: 'daily', days: [], date: MON } },
  { id: 'walk', minutes: 10, repeat: { type: 'days', days: [1], date: MON } }, // Mondays
  { id: 'cook', minutes: 10, repeat: { type: 'once', days: [], date: TUE } },
]
const base = () => ({ ...emptyState(), setupDone: true, tasks })

describe('scheduledTasks (B-04)', () => {
  it('shows only the tasks for that day', () => {
    expect(scheduledTasks(tasks, MON).map((t) => t.id)).toEqual(['water', 'walk'])
    expect(scheduledTasks(tasks, TUE).map((t) => t.id)).toEqual(['water', 'cook'])
  })

  it('starts each day clean', () => {
    const s = toggleTask(base(), MON, 'water')
    expect(getDay(s, MON).done).toEqual(['water'])
    expect(getDay(s, TUE).done).toEqual([])
  })
})

describe('mark and undo (B-05)', () => {
  it('adds minutes right away and takes them back on undo', () => {
    let s = toggleTask(base(), MON, 'water')
    expect(s.treasure).toBe(2)
    s = toggleTask(s, MON, 'water')
    expect(s.treasure).toBe(0)
  })

  it('adds the day bonus when the day is complete, and removes it on undo', () => {
    let s = toggleTask(base(), MON, 'water')
    s = toggleTask(s, MON, 'walk')
    expect(s.treasure).toBe(2 + 10 + DAY_BONUS)
    s = toggleTask(s, MON, 'walk')
    expect(s.treasure).toBe(2)
    expect(getDay(s, MON).bonus).toBe(false)
  })

  it('never goes below 0 when minutes were already used', () => {
    let s = toggleTask(base(), MON, 'walk')
    s = { ...s, treasure: 3 } // minutes taken in between
    s = toggleTask(s, MON, 'walk')
    expect(s.treasure).toBe(0)
  })
})

describe('difficult task (B-06)', () => {
  it('pays the difficult value and counts for the bonus', () => {
    let s = toggleTask(base(), MON, 'water')
    s = toggleTask(s, MON, 'walk')
    expect(getDay(s, MON).bonus).toBe(true)
    s = addDifficult(s, MON, 'Llamar al banco')
    expect(getDay(s, MON).bonus).toBe(false) // a new open task means the day is not complete
    expect(s.treasure).toBe(12)
    const id = getDay(s, MON).difficult[0].id
    s = toggleDifficult(s, MON, id)
    expect(s.treasure).toBe(12 + DIFFICULT_MINUTES + DAY_BONUS)
  })

  it('removing an unmarked difficult task gives the bonus back', () => {
    let s = toggleTask(base(), MON, 'water')
    s = toggleTask(s, MON, 'walk')
    s = addDifficult(s, MON, 'Llamar al banco')
    s = removeDifficult(s, MON, getDay(s, MON).difficult[0].id)
    expect(s.treasure).toBe(12 + DAY_BONUS)
  })

  it('an unfinished one is suggested the next day, once', () => {
    let s = addDifficult(base(), MON, 'Llamar al banco')
    expect(yesterdaySuggestions(s, TUE).map((d) => d.title)).toEqual(['Llamar al banco'])
    s = addDifficult(s, TUE, 'Llamar al banco')
    expect(yesterdaySuggestions(s, TUE)).toEqual([])
    expect(yesterdaySuggestions(s, '2026-11-18').map((d) => d.title)).toEqual(['Llamar al banco'])
  })

  it('a finished one is not suggested', () => {
    let s = addDifficult(base(), MON, 'Llamar al banco')
    s = toggleDifficult(s, MON, getDay(s, MON).difficult[0].id)
    expect(yesterdaySuggestions(s, TUE)).toEqual([])
  })
})
