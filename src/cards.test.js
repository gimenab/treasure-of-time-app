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
