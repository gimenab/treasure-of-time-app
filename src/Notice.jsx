import { copy } from './copy.js'
import { needsIphoneTip } from './storage.js'

// First-visit notice (C-21). Shown once, as a quiet banner, not a pop-up.
export default function Notice({ onOk }) {
  const t = copy.notice
  return (
    <section className="mb-6 rounded-2xl border border-gold/30 bg-gold-soft p-4 text-sm">
      <h2 className="font-semibold">{t.title}</h2>
      <p className="mt-1 text-muted">{t.body}</p>
      {needsIphoneTip() && <p className="mt-2 text-muted">{t.iphoneTip}</p>}
      <button
        onClick={onOk}
        className="mt-3 rounded-full bg-ink px-4 py-2 text-paper"
      >
        {t.ok}
      </button>
    </section>
  )
}
