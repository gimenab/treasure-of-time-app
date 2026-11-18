import { useState } from 'react'
import { copy } from './copy.js'
import {
  DAY_BONUS,
  DIFFICULT_MINUTES,
  addDifficult,
  getDay,
  removeDifficult,
  scheduledTasks,
  toggleDifficult,
  toggleTask,
  yesterdaySuggestions,
} from './day.js'

const t = copy.today

// Today's list (B-04 to B-06): routine tasks scheduled for today, difficult tasks and
// yesterday's unfinished difficult task as an inline suggestion.
export default function Today({ state, setState, dayKey }) {
  const [draft, setDraft] = useState('')
  const [writing, setWriting] = useState(false)
  const [open, setOpen] = useState(true)
  const day = getDay(state, dayKey)
  const routine = scheduledTasks(state.tasks, dayKey)
  const suggestions = yesterdaySuggestions(state, dayKey)
  const apply = (fn) => setState((s) => fn(s))

  const add = (title) => {
    if (!title.trim()) return
    apply((s) => addDifficult(s, dayKey, title))
    setDraft('')
    setWriting(false)
  }

  const showForm = day.difficult.length === 0 || writing
  const total = routine.length + day.difficult.length
  const doneCount =
    routine.filter((r) => day.done.includes(r.id)).length +
    day.difficult.filter((d) => d.done).length

  return (
    <section className="mt-8">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between font-semibold"
      >
        <span>{t.title}</span>
        <span className="text-sm font-normal text-muted">
          {total > 0 && t.progress(doneCount, total)} {open ? '▴' : '▾'}
        </span>
      </button>

      <div className={open ? '' : 'hidden'}>
        {total === 0 && (
          <p className="mt-2 text-sm text-muted">{t.empty}</p>
        )}

        <ul className="mt-2 space-y-2">
          {routine.map((task) => (
            <Row
              key={task.id}
              title={task.title}
              minutes={task.minutes}
              done={day.done.includes(task.id)}
              onToggle={() => apply((s) => toggleTask(s, dayKey, task.id))}
            />
          ))}
          {day.difficult.map((d) => (
            <Row
              key={d.id}
              title={d.title}
              minutes={DIFFICULT_MINUTES}
              badge={t.difficultBadge}
              done={d.done}
              onToggle={() => apply((s) => toggleDifficult(s, dayKey, d.id))}
              onRemove={d.done ? null : () => apply((s) => removeDifficult(s, dayKey, d.id))}
            />
          ))}
        </ul>

        {total > 0 && (
          <p className="mt-3 text-sm text-muted">
            {day.bonus ? t.bonusEarned(DAY_BONUS) : t.bonusHint(DAY_BONUS)}
          </p>
        )}

        {suggestions.map((d) => (
          <div
            key={d.id}
            className="mt-4 flex items-center gap-3 rounded-2xl border border-dashed border-ink/20 px-4 py-3 text-sm"
          >
            <span className="flex-1 text-muted">{t.yesterday(d.title)}</span>
            <button onClick={() => add(d.title)} className="font-medium text-accent underline">
              {t.addAgain}
            </button>
          </div>
        ))}

        <div className="mt-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">
            {t.difficultTitle}
          </h3>
          {showForm ? (
            <>
              <p className="text-sm text-muted">{t.difficultHint(DIFFICULT_MINUTES)}</p>
              <div className="mt-2 flex gap-2">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && add(draft)}
                  placeholder={t.difficultPlaceholder}
                  maxLength={80}
                  className="min-w-0 flex-1 rounded-lg border border-ink/15 bg-card px-3 py-2"
                />
                <button
                  onClick={() => add(draft)}
                  disabled={!draft.trim()}
                  className="rounded-full border border-ink px-4 text-sm disabled:opacity-40"
                >
                  {t.difficultAdd}
                </button>
              </div>
            </>
          ) : (
            <button onClick={() => setWriting(true)} className="mt-1 text-sm text-accent underline">
              {t.difficultMore}
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

function Row({ title, minutes, done, badge, onToggle, onRemove }) {
  return (
    <li className="flex items-center gap-3 rounded-2xl bg-card px-4 py-3 shadow-sm">
      <button
        onClick={onToggle}
        aria-pressed={done}
        className={`flex size-7 shrink-0 items-center justify-center rounded-full border-2 ${
          done ? 'border-accent bg-accent text-paper' : 'border-ink/25'
        }`}
      >
        {done && '✓'}
      </button>
      <span className={`flex-1 ${done ? 'text-muted line-through' : ''}`}>
        {title}
        {badge && (
          <span className="ml-2 rounded-full bg-accent-soft px-2 py-0.5 text-xs text-ink">
            {badge}
          </span>
        )}
      </span>
      {done ? (
        <button onClick={onToggle} className="text-sm text-muted underline">
          {t.undo}
        </button>
      ) : (
        <>
          {onRemove && (
            <button onClick={onRemove} className="text-sm text-muted underline">
              {t.remove}
            </button>
          )}
          <span className="text-sm text-muted">{copy.min(minutes)}</span>
        </>
      )}
    </li>
  )
}
