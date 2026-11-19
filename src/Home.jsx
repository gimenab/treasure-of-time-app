import { useEffect, useRef, useState } from 'react'
import { closeCard, pickCard } from './cards.js'
import { copy } from './copy.js'
import { openPending, registerPending } from './moments.js'
import Notice from './Notice.jsx'
import Register from './Register.jsx'
import TakeTime from './TakeTime.jsx'
import Today from './Today.jsx'

// Ink glow when the balance goes up (style 2026-11-18). A new key restarts the animation.
function useGlowKey(value) {
  const prev = useRef(value)
  const [key, setKey] = useState(0)
  useEffect(() => {
    if (value > prev.current) setKey((k) => k + 1)
    prev.current = value
  }, [value])
  return key
}

// Home (B-07): "Your treasure" and "minutes lived" in short, at most one card, today's list
// "minutes lived" opens the moments screen (B-11, founder's change 2026-11-18).
// No streaks, nothing that resets, no random rewards, no weekly targets (C-09).
export default function Home({ state, setState, dayKey, onOpenTreasure, onOpenMoments }) {
  const t = copy.home
  const card = pickCard(state, dayKey)
  const close = (id) => setState((s) => closeCard(s, id, dayKey))
  const glowKey = useGlowKey(state.treasure)

  return (
    <div>
      <div className="flex gap-3">
        <button
          onClick={onOpenTreasure}
          className="flex-1 rounded-2xl bg-card px-5 py-4 text-left shadow-sm"
        >
          <span className="block text-sm text-muted">{t.treasure}</span>
          <span
            key={glowKey}
            className={`font-display text-3xl text-accent${glowKey ? ' glow' : ''}`}
          >
            {t.minutes(state.treasure)}
          </span>
          <span className="mt-1 block text-sm text-muted underline">{t.open}</span>
        </button>
        <button
          onClick={onOpenMoments}
          className="flex-1 rounded-2xl bg-card px-5 py-4 text-left shadow-sm"
        >
          <span className="block text-sm text-muted">{t.lived}</span>
          <span className="font-display text-accent text-3xl">{t.minutes(state.minutesLived)}</span>
          <span className="mt-1 block text-sm text-muted underline">{t.openMoments}</span>
        </button>
      </div>
      <TakeTime state={state} setState={setState} />

      {card === 'notice' && (
        <div className="mt-6">
          <Notice onOk={() => close('notice')} />
        </div>
      )}
      {card === 'pending' && (
        <PendingCard state={state} setState={setState} dayKey={dayKey} onClose={() => close('pending')} />
      )}

      <Today state={state} setState={setState} dayKey={dayKey} />
    </div>
  )
}

// Time used and not registered yet: it can be registered until the end of the next day (row 22).
function PendingCard({ state, setState, dayKey, onClose }) {
  const t = copy.register
  const [writing, setWriting] = useState(false)
  const pending = openPending(state, dayKey)[0]

  return (
    <section className="mt-6 rounded-2xl border border-accent/30 bg-accent-soft p-4 text-sm">
      <h2 className="font-display text-accent text-xl">{t.pendingTitle(pending.minutes)}</h2>
      <p className="mt-1 text-muted">{t.pendingHint}</p>
      {writing ? (
        <Register
          onRegister={(moment) => setState((s) => registerPending(s, dayKey, pending.id, moment))}
          onSkip={() => setWriting(false)}
          skipLabel={t.cancel}
        />
      ) : (
        <div className="mt-3 flex gap-2">
          <button onClick={() => setWriting(true)} className="rounded-full bg-accent px-4 py-2 font-semibold text-paper">
            {t.pendingOpen}
          </button>
          <button onClick={onClose} className="rounded-full border border-ink px-4 py-2">
            {t.pendingClose}
          </button>
        </div>
      )}
    </section>
  )
}
