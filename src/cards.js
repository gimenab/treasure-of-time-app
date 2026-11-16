// One card at a time on the home (B-07, C-16, user-flow row 27): no pop-ups, at most one card
// per opening, and a card the user closes does not come back that day.
// Phase 1 has a single card; the adjustment notice and the relax-time card were cut (CR-02)
// and will be added to this list in priority order.
const CARDS = [{ id: 'notice', show: (state) => !state.noticeSeen }]

export function pickCard(state, dayKey) {
  const card = CARDS.find((c) => c.show(state) && state.closedCards?.[c.id] !== dayKey)
  return card?.id ?? null
}

export function closeCard(state, id, dayKey) {
  const next = { ...state, closedCards: { ...state.closedCards, [id]: dayKey } }
  return id === 'notice' ? { ...next, noticeSeen: true } : next
}
