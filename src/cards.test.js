import { describe, expect, it } from 'vitest'
import { closeCard, pickCard } from './cards.js'
import { emptyState } from './storage.js'

describe('one card at a time (B-07)', () => {
  it('shows the notice until it is closed, and never again', () => {
    const s = { ...emptyState(), setupDone: true }
    expect(pickCard(s, '2026-11-16')).toBe('notice')
    const closed = closeCard(s, 'notice', '2026-11-16')
    expect(pickCard(closed, '2026-11-16')).toBeNull()
    expect(pickCard(closed, '2026-11-17')).toBeNull()
  })
})

describe('pending moment card (B-10)', () => {
  const withPending = (day) => ({ ...emptyState(), noticeSeen: true, pending: [{ id: 'p', day, minutes: 6 }] })

  it('shows until the end of the next day', () => {
    expect(pickCard(withPending('2026-11-16'), '2026-11-17')).toBe('pending')
    expect(pickCard(withPending('2026-11-16'), '2026-11-18')).toBeNull()
  })

  it('does not come back the day it was closed', () => {
    const s = closeCard(withPending('2026-11-17'), 'pending', '2026-11-17')
    expect(pickCard(s, '2026-11-17')).toBeNull()
  })
})
