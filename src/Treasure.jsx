import { useRef, useState } from 'react'
import { copy } from './copy.js'
import { formatDate } from './date.js'
import { backupFile, emptyState, parseBackup } from './storage.js'

const t = copy.treasure

// "Your treasure" view (B-07, C-04) with the user's data controls (B-08, C-22).
export default function Treasure({ state, setState, dayKey, onBack }) {
  return (
    <div>
      <button onClick={onBack} className="text-sm text-muted underline">
        ← {t.back}
      </button>
      <section className="mt-4 rounded-2xl bg-white p-6 text-center shadow-sm">
        <p className="text-sm text-muted">{t.title}</p>
        <p className="mt-1 text-5xl font-semibold text-gold">{copy.home.minutes(state.treasure)}</p>
        <p className="mt-4 text-sm text-muted">{t.body}</p>
      </section>
      <DataSection state={state} setState={setState} dayKey={dayKey} />
    </div>
  )
}

// On the first visit only "restore" is offered, so a new device can load a copy (C-22).
export function DataSection({ state, setState, dayKey, firstVisit = false }) {
  const fileInput = useRef(null)
  const [pending, setPending] = useState(null) // { kind: 'restore', state, date } | { kind: 'delete' }
  const [message, setMessage] = useState('')

  const exportCopy = () => {
    const { name, blob } = backupFile(state, dayKey)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = name
    a.click()
    URL.revokeObjectURL(url)
    setMessage(t.exported)
  }

  const pickFile = async (e) => {
    const file = e.target.files[0]
    e.target.value = ''
    if (!file) return
    const text = await file.text()
    const restored = parseBackup(text)
    if (!restored) {
      setPending(null)
      setMessage(t.restoreInvalid)
      return
    }
    setMessage('')
    setPending({ kind: 'restore', state: restored, date: JSON.parse(text).exportedOn })
  }

  const confirm = () => {
    if (pending.kind === 'restore') {
      setState(pending.state)
      setMessage(t.restored)
    } else {
      setState(emptyState())
    }
    setPending(null)
  }

  return (
    <section className="mt-8">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
        {firstVisit ? t.firstVisitTitle : t.dataTitle}
      </h2>
      <p className="text-sm text-muted">{firstVisit ? t.firstVisitHint : t.dataHint}</p>

      <div className="mt-3 flex flex-col gap-2">
        {!firstVisit && (
          <button onClick={exportCopy} className="rounded-full border border-ink py-2">
            {t.export}
          </button>
        )}
        <button
          onClick={() => fileInput.current.click()}
          className="rounded-full border border-ink py-2"
        >
          {t.restore}
        </button>
        <input
          ref={fileInput}
          type="file"
          accept="application/json,.json"
          onChange={pickFile}
          className="hidden"
        />
        {!firstVisit && (
          <button
            onClick={() => {
              setMessage('')
              setPending({ kind: 'delete' })
            }}
            className="py-2 text-sm text-muted underline"
          >
            {t.delete}
          </button>
        )}
      </div>

      {message && <p className="mt-3 text-center text-sm text-muted">{message}</p>}

      {pending && (
        <div className="mt-4 rounded-2xl border border-gold/40 bg-gold-soft p-4 text-sm">
          <p>
            {pending.kind === 'restore'
              ? t.restoreConfirm(formatDate(pending.date))
              : t.deleteConfirm}
          </p>
          <div className="mt-3 flex gap-2">
            <button onClick={confirm} className="rounded-full bg-ink px-4 py-2 text-paper">
              {pending.kind === 'restore' ? t.restoreYes : t.deleteYes}
            </button>
            <button onClick={() => setPending(null)} className="px-4 py-2 underline">
              {t.cancel}
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
