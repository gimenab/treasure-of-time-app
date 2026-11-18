import { useState } from 'react'
import { copy } from './copy.js'
import { maxMinutes, startTimer } from './timer.js'

const t = copy.take
const QUICK = [5, 10, 15]

// Choosing how much time to take (B-09). Never more than the balance.
export default function TakeTime({ state, setState }) {
  const max = maxMinutes(state)
  const [picked, setPicked] = useState(null) // number | 'other'
  const [other, setOther] = useState('')

  if (max <= 0) {
    return <p className="mt-4 text-sm text-muted">{t.empty}</p>
  }

  const minutes = picked === 'other' ? Math.min(Math.floor(Number(other)), max) : picked
  const valid = minutes > 0 && minutes <= max
  const chip = (active) =>
    `rounded-full border px-4 py-2 text-sm disabled:opacity-40 ${
      active ? 'border-gold bg-gold-soft' : 'border-ink/20 bg-card'
    }`

  return (
    <section className="mt-4 rounded-2xl bg-card p-5 shadow-sm">
      <h2 className="font-display text-lg font-semibold">{t.title}</h2>
      <p className="text-sm text-muted">{t.hint}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        <button onClick={() => setPicked(max)} className={chip(picked === max)}>
          {t.all(max)}
        </button>
        {QUICK.map((n) => (
          <button key={n} disabled={n > max} onClick={() => setPicked(n)} className={chip(picked === n)}>
            {n}
          </button>
        ))}
        <button onClick={() => setPicked('other')} className={chip(picked === 'other')}>
          {t.other}
        </button>
      </div>

      {picked === 'other' && (
        <label className="mt-3 flex items-center gap-2 text-sm">
          {t.otherLabel}
          <input
            type="number"
            inputMode="numeric"
            min="1"
            max={max}
            value={other}
            onChange={(e) => setOther(e.target.value)}
            className="w-20 rounded-lg border border-ink/20 px-2 py-1"
            autoFocus
          />
          <span className="text-muted">/ {max}</span>
        </label>
      )}

      <button
        disabled={!valid}
        onClick={() => setState((s) => startTimer(s, minutes, Date.now()))}
        className="mt-4 w-full rounded-full bg-gold py-2 font-semibold text-paper disabled:opacity-40"
      >
        {t.start(valid && minutes)}
      </button>
    </section>
  )
}
