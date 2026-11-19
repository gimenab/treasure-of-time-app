import { describe, expect, it } from 'vitest'
import { addDifficult, toggleDifficult, toggleTask } from './day.js'
import { photoFitsMoment, registerFromTimer, registerPending, skipFromTimer } from './moments.js'
import { emptyState, parseBackup } from './storage.js'
import { settleTimer, stopTimer } from './timer.js'
import { getWildcard, startWildcard, tasksLeft } from './wildcard.js'

const MON = '2026-11-16'
const TUE = '2026-11-17'
const MIN = 60_000
const tasks = ['a', 'b', 'c', 'd'].map((id) => ({
  id,
  title: id,
  category: 'home',
  minutes: 5,
  custom: false,
  repeat: { type: 'daily' },
}))
const base = () => ({ ...emptyState(), setupDone: true, tasks })
const used = () => startWildcard(base(), 0)

describe('startWildcard (S-01)', () => {
  it('starts with one wildcard, also in old copies without the field', () => {
    expect(getWildcard(base()).held).toBe(true)
    const { wildcard, ...old } = base()
    const text = JSON.stringify({ app: 'treasure-time', state: old })
    expect(getWildcard(parseBackup(text)).held).toBe(true)
  })

  it('gives 15 minutes with 0 earned and does not touch the treasure', () => {
    const s = used()
    expect(s.treasure).toBe(0)
    expect(s.timer).toMatchObject({ minutes: 15, wildcard: true })
    expect(getWildcard(s).held).toBe(false)
  })

  it('holds at most 1: it cannot be used twice', () => {
    const s = stopTimer(used(), 5 * MIN, false)
    const again = startWildcard({ ...s, timer: null }, 10 * MIN)
    expect(again.timer).toBeNull()
  })

  it('unused wildcard minutes do not go to the treasure', () => {
    const s = stopTimer(used(), 5 * MIN, true)
    expect(s.treasure).toBe(0)
    expect(s.timer.used).toBe(5)
  })
})

describe('next wildcard after 3 tasks', () => {
  it('comes back after 3 tasks marked after using it', () => {
    let s = { ...used(), timer: null }
    s = toggleTask(s, MON, 'a')
    s = toggleTask(s, MON, 'b')
    expect(tasksLeft(s)).toBe(1)
    s = toggleTask(s, MON, 'c')
    expect(getWildcard(s)).toEqual({ held: true, tasksSince: 0 })
  })

  it('an undone task stops counting', () => {
    let s = { ...used(), timer: null }
    s = toggleTask(s, MON, 'a')
    s = toggleTask(s, MON, 'b')
    s = toggleTask(s, MON, 'b')
    expect(getWildcard(s).tasksSince).toBe(1)
  })

  it('difficult tasks count too', () => {
    let s = addDifficult({ ...used(), timer: null }, MON, 'Llamar al banco')
    s = toggleDifficult(s, MON, s.days[MON].difficult[0].id)
    expect(getWildcard(s).tasksSince).toBe(1)
  })

  it('tasks marked while holding one do not count', () => {
    const s = toggleTask(base(), MON, 'a')
    expect(getWildcard(s)).toEqual({ held: true, tasksSince: 0 })
  })
})

describe('wildcard moments keep their mark', () => {
  it('when registered from the timer', () => {
    const s = registerFromTimer(settleTimer(used(), 15 * MIN), MON, { note: 'Siesta' })
    expect(s.moments[0]).toMatchObject({ minutes: 15, wildcard: true })
    expect(s.minutesLived).toBe(15)
  })

  it('when left for later', () => {
    const s = skipFromTimer(settleTimer(used(), 15 * MIN), MON)
    const r = registerPending(s, TUE, s.pending[0].id, { note: 'Siesta' })
    expect(r.moments[0].wildcard).toBe(true)
  })
})

describe('photoFitsMoment (founder, 2026-11-19)', () => {
  it('accepts a photo from the moment day or from today', () => {
    expect(photoFitsMoment(MON, MON, MON)).toBe(true)
    expect(photoFitsMoment(TUE, MON, TUE)).toBe(true)
  })

  it('rejects a photo from another day', () => {
    expect(photoFitsMoment('2026-11-10', MON, TUE)).toBe(false)
  })
})
