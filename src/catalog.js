// Catalog of 10 predefined tasks (confirmed by the founder, 2026-11-16).
// Values follow the brief's examples, max +15. Titles live in copy.js.
export const CATEGORIES = ['health', 'home', 'work']

export const CATALOG = [
  { id: 'water', category: 'health', minutes: 2 },
  { id: 'meds', category: 'health', minutes: 2 },
  { id: 'pause', category: 'health', minutes: 5 },
  { id: 'walk', category: 'health', minutes: 10 },
  { id: 'bed', category: 'home', minutes: 2 },
  { id: 'dishes', category: 'home', minutes: 5 },
  { id: 'cook', category: 'home', minutes: 10 },
  { id: 'pending', category: 'work', minutes: 5 },
  { id: 'focus', category: 'work', minutes: 15 },
  { id: 'study', category: 'work', minutes: 15 },
]

// Values a custom routine task can take (same range as the catalog).
export const CUSTOM_MINUTES = [2, 5, 10, 15]
