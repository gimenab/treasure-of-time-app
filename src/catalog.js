// Catalog of 10 predefined tasks (confirmed by the founder, 2026-11-16).
// Values follow the brief's examples, max +15. Titles live in copy.js.
export const CATEGORIES = ['health', 'home', 'work']

export const CATALOG = [
  { id: 'water', category: 'health', minutes: 1 },
  { id: 'meds', category: 'health', minutes: 1 },
  { id: 'pause', category: 'health', minutes: 2 },
  { id: 'walk', category: 'health', minutes: 5 },
  { id: 'bed', category: 'home', minutes: 1 },
  { id: 'dishes', category: 'home', minutes: 2 },
  { id: 'cook', category: 'home', minutes: 5 },
  { id: 'pending', category: 'work', minutes: 3 },
  { id: 'focus', category: 'work', minutes: 10 },
  { id: 'study', category: 'work', minutes: 10 },
]

// Values a custom routine task can take (same range as the catalog).
export const CUSTOM_MINUTES = [1, 3, 5, 10]

// Scale 2 (founder, 2026-11-19): earning was too easy with simple tasks, so every value went
// down. Custom tasks made with scale 1 move only if their value no longer exists.
export const SCALE = 2
export const OLD_CUSTOM_MINUTES = { 2: 1, 15: 10 }
