import { useState } from 'react'
import { CATALOG, CATEGORIES, CUSTOM_MINUTES } from './catalog.js'
import { copy } from './copy.js'
import { todayKey } from './date.js'

const t = copy.setup

const newRepeat = () => ({ type: 'daily', days: [], date: todayKey() })

// A repeat is valid unless "some days" has no day picked.
const repeatOk = (r) => r.type !== 'days' || r.days.length > 0

// First visit (B-03, C-10): the only step. Pick from the catalog, set how each repeats,
// optionally add custom routine tasks. No questionnaire.
export default function Setup({ onDone }) {
  const [picked, setPicked] = useState({}) // catalog id -> repeat
  const [custom, setCustom] = useState([]) // { id, title, minutes, repeat }
  const [draft, setDraft] = useState('')
  const [draftMinutes, setDraftMinutes] = useState(5)

  const toggle = (id) =>
    setPicked((p) => {
      const next = { ...p }
      if (next[id]) delete next[id]
      else next[id] = newRepeat()
      return next
    })

  const setRepeat = (id, repeat) => setPicked((p) => ({ ...p, [id]: repeat }))

  const addCustom = () => {
    const title = draft.trim()
    if (!title) return
    setCustom((c) => [
      ...c,
      { id: `custom-${Date.now()}`, title, minutes: draftMinutes, repeat: newRepeat() },
    ])
    setDraft('')
  }

  const setCustomRepeat = (id, repeat) =>
    setCustom((c) => c.map((x) => (x.id === id ? { ...x, repeat } : x)))

  const all = [
    ...CATALOG.filter((task) => picked[task.id]).map((task) => ({
      id: task.id,
      title: copy.tasks[task.id],
      category: task.category,
      minutes: task.minutes,
      custom: false,
      repeat: picked[task.id],
    })),
    ...custom.map((x) => ({ ...x, category: 'custom', custom: true })),
  ]
  const canFinish = all.length > 0 && all.every((x) => repeatOk(x.repeat))

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">{t.title}</h1>
      <p className="mt-1 text-muted">{t.intro}</p>

      {CATEGORIES.map((cat) => (
        <section key={cat} className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
            {t.categories[cat]}
          </h2>
          <ul className="mt-2 space-y-2">
            {CATALOG.filter((task) => task.category === cat).map((task) => (
              <li key={task.id} className="rounded-2xl bg-card p-3 shadow-sm">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={!!picked[task.id]}
                    onChange={() => toggle(task.id)}
                    className="size-5 accent-gold"
                  />
                  <span className="flex-1">{copy.tasks[task.id]}</span>
                  <span className="text-sm text-muted">{copy.min(task.minutes)}</span>
                </label>
                {picked[task.id] && (
                  <RepeatPicker
                    value={picked[task.id]}
                    onChange={(r) => setRepeat(task.id, r)}
                  />
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section className="mt-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
          {t.customTitle}
        </h2>
        <p className="text-sm text-muted">{t.customHint}</p>
        <ul className="mt-2 space-y-2">
          {custom.map((x) => (
            <li key={x.id} className="rounded-2xl bg-card p-3 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex-1">{x.title}</span>
                <span className="text-sm text-muted">{copy.min(x.minutes)}</span>
                <button
                  onClick={() => setCustom((c) => c.filter((y) => y.id !== x.id))}
                  className="text-sm text-muted underline"
                >
                  {t.remove}
                </button>
              </div>
              <RepeatPicker value={x.repeat} onChange={(r) => setCustomRepeat(x.id, r)} />
            </li>
          ))}
        </ul>
        <div className="mt-2 rounded-2xl bg-card p-3 shadow-sm">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCustom()}
            placeholder={t.customPlaceholder}
            maxLength={60}
            className="w-full rounded-lg border border-ink/15 px-3 py-2"
          />
          <div className="mt-2 flex items-center gap-2 text-sm">
            <span className="text-muted">{t.customMinutes}</span>
            {CUSTOM_MINUTES.map((m) => (
              <Chip key={m} active={draftMinutes === m} onClick={() => setDraftMinutes(m)}>
                {copy.min(m)}
              </Chip>
            ))}
          </div>
          <button
            onClick={addCustom}
            disabled={!draft.trim()}
            className="mt-3 rounded-full border border-ink px-4 py-1.5 text-sm disabled:opacity-40"
          >
            {t.customAdd}
          </button>
        </div>
      </section>

      <button
        onClick={() => onDone(all)}
        disabled={!canFinish}
        className="mt-8 w-full rounded-full bg-gold py-3 font-semibold text-paper disabled:opacity-40"
      >
        {all.length === 0 ? t.doneDisabled : t.done}
      </button>
    </div>
  )
}

function RepeatPicker({ value, onChange }) {
  const toggleDay = (day) =>
    onChange({
      ...value,
      days: value.days.includes(day)
        ? value.days.filter((d) => d !== day)
        : [...value.days, day],
    })

  return (
    <div className="mt-3 space-y-2 pl-8 text-sm">
      <div className="flex flex-wrap gap-2">
        {['daily', 'days', 'once'].map((type) => (
          <Chip key={type} active={value.type === type} onClick={() => onChange({ ...value, type })}>
            {t.repeat[type]}
          </Chip>
        ))}
      </div>
      {value.type === 'days' && (
        <div>
          <div className="flex gap-1">
            {copy.weekdays.map(({ day, short }) => (
              <Chip key={day} active={value.days.includes(day)} onClick={() => toggleDay(day)}>
                {short}
              </Chip>
            ))}
          </div>
          {value.days.length === 0 && <p className="mt-1 text-gold">{t.pickDays}</p>}
        </div>
      )}
      {value.type === 'once' && (
        <label className="flex items-center gap-2">
          <span className="text-muted">{t.onceDate}</span>
          <input
            type="date"
            value={value.date}
            min={todayKey()}
            onChange={(e) => onChange({ ...value, date: e.target.value || todayKey() })}
            className="rounded-lg border border-ink/15 px-2 py-1"
          />
        </label>
      )}
    </div>
  )
}

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 ${
        active ? 'border-gold bg-gold-soft text-ink' : 'border-ink/15 text-muted'
      }`}
    >
      {children}
    </button>
  )
}
