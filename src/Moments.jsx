import { useState } from 'react'
import { copy } from './copy.js'
import { formatDate } from './date.js'
import { deleteMoment } from './moments.js'

const t = copy.feed

// "Your moments" screen (B-11, moved off the home by the founder's change, 2026-11-18):
// a polaroid grid, two per row, newest first. A place to look back:
// no counts, no streaks, no "you have not posted" messages (C-18).
export default function Moments({ moments, setState, onBack }) {
  const list = [...(moments ?? [])].sort((a, b) => b.at - a.at)
  const [open, setOpen] = useState(null)

  return (
    <div>
      <button onClick={onBack} className="text-sm text-muted underline">
        ← {t.back}
      </button>
      <h1 className="mt-4 font-display text-accent text-3xl">{t.title}</h1>
      {list.length === 0 ? (
        <p className="mt-2 text-sm text-muted">{t.empty}</p>
      ) : (
        <ul className="mt-4 grid grid-cols-2 gap-3">
          {list.map((m) => (
            <li key={m.id} className="flex">
              <button
                onClick={() => setOpen(m)}
                className="flex w-full flex-col rounded-sm bg-card p-2 pb-3 text-left shadow-md"
              >
                <div className="relative">
                  {m.photo ? (
                    <img src={m.photo} alt="" className="aspect-square w-full object-cover" />
                  ) : (
                    <p className="line-clamp-6 aspect-square w-full overflow-hidden bg-accent-soft p-3 font-display text-accent text-xl leading-tight">
                      {m.note}
                    </p>
                  )}
                  <span className="absolute bottom-1 right-1 rounded-full bg-ink/75 px-2 py-0.5 text-xs font-semibold text-paper">
                    {t.minutes(m.minutes)}
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted">{formatDate(m.day)}</p>
                {/* Same space under every card, so text-only moments are as tall as photo ones. */}
                <p className="mt-0.5 line-clamp-2 min-h-10 text-sm">{m.photo ? m.note : ''}</p>
              </button>
            </li>
          ))}
        </ul>
      )}
      {open && (
        <MomentModal
          moment={open}
          onClose={() => setOpen(null)}
          onDelete={() => {
            setState((s) => deleteMoment(s, open.id))
            setOpen(null)
          }}
        />
      )}
    </div>
  )
}

function MomentModal({ moment, onClose, onDelete }) {
  const [confirming, setConfirming] = useState(false)
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-10 flex items-center justify-center bg-ink/40 px-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90dvh] w-full max-w-sm overflow-y-auto rounded-sm bg-card p-3 pb-4 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {moment.photo && <img src={moment.photo} alt="" className="w-full" />}
        <p className="mt-3 text-sm text-muted">{t.meta(formatDate(moment.day), moment.minutes)}</p>
        <p className="mt-1 whitespace-pre-line">{moment.note}</p>
        {confirming ? (
          <div className="mt-4 rounded-lg bg-accent-soft p-3 text-sm">
            <p>{t.deleteConfirm(moment.minutes)}</p>
            <div className="mt-3 flex gap-2">
              <button onClick={onDelete} className="rounded-full bg-accent px-4 py-2 font-semibold text-paper">
                {t.deleteYes}
              </button>
              <button onClick={() => setConfirming(false)} className="px-4 py-2 underline">
                {t.cancel}
              </button>
            </div>
          </div>
        ) : (
          <>
            <button
              onClick={onClose}
              className="mt-4 w-full rounded-full bg-accent py-2 font-semibold text-paper"
            >
              {t.close}
            </button>
            <button onClick={() => setConfirming(true)} className="mt-2 w-full py-2 text-sm text-muted underline">
              {t.delete}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
