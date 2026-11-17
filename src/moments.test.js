import { describe, expect, it } from 'vitest'
import { openPending, registerFromTimer, registerPending, skipFromTimer } from './moments.js'
import { emptyState } from './storage.js'
import { startTimer, stopTimer } from './timer.js'

const MON = '2026-11-16'
const TUE = '2026-11-17'
const WED = '2026-11-18'
const MIN = 60_000

// Took 10 of 30, used 6 and saved the other 4.
const finished = () => stopTimer(startTimer({ ...emptyState(), treasure: 30 }, 10, 0), 6 * MIN, true)

describe('registerFromTimer (B-10)', () => {
  it('adds the time used to "minutes lived" and saves the note', () => {
    const s = registerFromTimer(finished(), MON, { note: ' Tomé mate al sol ' })
    expect(s.minutesLived).toBe(6)
    expect(s.treasure).toBe(24)
    expect(s.timer).toBeNull()
    expect(s.moments).toHaveLength(1)
    expect(s.moments[0]).toMatchObject({ day: MON, minutes: 6, note: 'Tomé mate al sol', photo: null })
  })

  it('keeps the photo with the moment', () => {
    const s = registerFromTimer(finished(), MON, { note: 'Plaza', photo: 'data:image/jpeg;base64,x' })
    expect(s.moments[0].photo).toBe('data:image/jpeg;base64,x')
  })

  it('needs a note', () => {
    const before = finished()
    expect(registerFromTimer(before, MON, { note: '  ' })).toBe(before)
  })
})

describe('"Not now" and registering later (row 22)', () => {
  it('leaves the moment waiting, without adding to "minutes lived"', () => {
    const s = skipFromTimer(finished(), MON)
    expect(s.timer).toBeNull()
    expect(s.minutesLived).toBe(0)
    expect(openPending(s, MON)).toHaveLength(1)
  })

  it('can be registered the next day, with the day it was taken', () => {
    let s = skipFromTimer(finished(), MON)
    const id = openPending(s, TUE)[0].id
    s = registerPending(s, TUE, id, { note: 'Caminata' })
    expect(s.minutesLived).toBe(6)
    expect(s.moments[0].day).toBe(MON)
    expect(s.pending).toHaveLength(0)
  })

  it('can no longer be registered after the next day', () => {
    let s = skipFromTimer(finished(), MON)
    expect(openPending(s, WED)).toHaveLength(0)
    const id = s.pending[0].id
    expect(registerPending(s, WED, id, { note: 'Tarde' })).toBe(s)
  })

  it('with no time used there is nothing to register', () => {
    const s = skipFromTimer(stopTimer(startTimer({ ...emptyState(), treasure: 5 }, 5, 0), 0, true), MON)
    expect(s.pending).toEqual([])
  })
})
