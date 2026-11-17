import { describe, expect, it } from 'vitest'
import { emptyState } from './storage.js'
import {
  closeTimer,
  leftMs,
  pauseTimer,
  resumeTimer,
  settleTimer,
  startTimer,
  stopTimer,
  unusedMinutes,
} from './timer.js'

const MIN = 60_000
const withTreasure = (n) => ({ ...emptyState(), setupDone: true, treasure: n })

describe('startTimer (B-09)', () => {
  it('takes the minutes out of the balance', () => {
    const s = startTimer(withTreasure(30), 10, 0)
    expect(s.treasure).toBe(20)
    expect(s.timer.minutes).toBe(10)
  })

  it('never takes more than the balance', () => {
    const s = startTimer(withTreasure(10), 30, 0)
    expect(s.treasure).toBe(0)
    expect(s.timer.minutes).toBe(10)
  })

  it('does nothing with a balance of 0 or an invalid amount', () => {
    expect(startTimer(withTreasure(0), 5, 0).timer).toBeNull()
    expect(startTimer(withTreasure(10), 0, 0).timer).toBeNull()
  })
})

describe('running, pausing and stopping on its own', () => {
  it('counts down on real time, also with the app closed', () => {
    const s = startTimer(withTreasure(10), 10, 0)
    expect(leftMs(s.timer, 4 * MIN)).toBe(6 * MIN)
  })

  it('freezes while paused and goes on after', () => {
    let s = startTimer(withTreasure(10), 10, 0)
    s = pauseTimer(s, 3 * MIN)
    expect(leftMs(s.timer, 50 * MIN)).toBe(7 * MIN)
    s = resumeTimer(s, 50 * MIN)
    expect(leftMs(s.timer, 52 * MIN)).toBe(5 * MIN)
  })

  it('stops on its own when the time runs out, all of it used', () => {
    let s = startTimer(withTreasure(10), 10, 0)
    expect(settleTimer(s, 9 * MIN)).toBe(s)
    s = settleTimer(s, 11 * MIN)
    expect(s.timer.finished).toBe(true)
    expect(s.timer.used).toBe(10)
    expect(s.treasure).toBe(0)
  })
})

describe('stopping early (row 14)', () => {
  it('takes 10, stops at 5 and saves: 5 go back', () => {
    let s = startTimer(withTreasure(10), 10, 0)
    s = stopTimer(s, 5 * MIN, true)
    expect(s.treasure).toBe(5)
    expect(s.timer.used).toBe(5)
  })

  it('counts the rest as used when not saved', () => {
    let s = startTimer(withTreasure(10), 10, 0)
    s = stopTimer(s, 5 * MIN, false)
    expect(s.treasure).toBe(0)
    expect(s.timer.used).toBe(10)
  })

  it('rounds to whole minutes', () => {
    const s = startTimer(withTreasure(10), 10, 0)
    expect(unusedMinutes(s.timer, 10_000)).toBe(10)
    expect(unusedMinutes(s.timer, 5 * MIN + 40_000)).toBe(4)
  })

  it('closing the timer leaves the balance as it was', () => {
    let s = stopTimer(startTimer(withTreasure(10), 10, 0), 5 * MIN, true)
    s = closeTimer(s)
    expect(s.timer).toBeNull()
    expect(s.treasure).toBe(5)
  })
})
