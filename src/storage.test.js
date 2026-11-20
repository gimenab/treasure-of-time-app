import { describe, expect, it } from 'vitest'
import { BACKUP_APP, backupFile, emptyState, parseBackup } from './storage.js'

const sample = () => ({
  ...emptyState(),
  setupDone: true,
  noticeSeen: true,
  treasure: 42,
  tasks: [{ id: 'water', minutes: 2, repeat: { type: 'daily', days: [], date: '2026-11-16' } }],
  days: { '2026-11-16': { done: ['water'], difficult: [], bonus: true } },
})

describe('export and restore (B-08)', () => {
  it('a restored copy gives the same totals', async () => {
    const { name, blob } = backupFile(sample(), '2026-11-16')
    expect(name).toBe('tu-tesoro-2026-11-16.json')
    expect(parseBackup(await blob.text())).toEqual(sample())
  })

  it('rejects files that are not a copy of this app', () => {
    expect(parseBackup('not json')).toBeNull()
    expect(parseBackup(JSON.stringify({ app: 'other', state: sample() }))).toBeNull()
    expect(parseBackup(JSON.stringify({ app: BACKUP_APP, state: { version: 1 } }))).toBeNull()
  })
})

describe('scale 2 (founder, 2026-11-19)', () => {
  it('moves old tasks to the new values and keeps the treasure', () => {
    const old = {
      ...emptyState(),
      scale: undefined,
      treasure: 48,
      tasks: [
        { id: 'water', minutes: 2, custom: false },
        { id: 'focus', minutes: 15, custom: false },
        { id: 'gym', minutes: 10, custom: true },
        { id: 'tea', minutes: 2, custom: true },
      ],
    }
    delete old.scale
    const s = parseBackup(JSON.stringify({ app: 'treasure-time', state: old }))
    expect(s.tasks.map((t) => t.minutes)).toEqual([1, 10, 10, 1])
    expect(s.treasure).toBe(48)
    expect(s.scale).toBe(2)
  })
})
