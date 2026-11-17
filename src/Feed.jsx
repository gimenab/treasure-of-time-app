import { copy } from './copy.js'
import { formatDate } from './date.js'

const t = copy.feed

// Moments lived, newest first (B-11, user-flow row 25). A place to look back:
// no counts, no streaks, no "you have not posted" messages (C-18).
export default function Feed({ moments }) {
  const list = [...(moments ?? [])].sort((a, b) => b.at - a.at)

  return (
    <section className="mt-8">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">{t.title}</h2>
      {list.length === 0 ? (
        <p className="mt-2 text-sm text-muted">{t.empty}</p>
      ) : (
        <ul className="mt-3 flex flex-col gap-3">
          {list.map((m) => (
            <li key={m.id} className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-sm text-muted">{t.meta(formatDate(m.day), m.minutes)}</p>
              <p className="mt-1 whitespace-pre-line">{m.note}</p>
              {m.photo && <img src={m.photo} alt="" className="mt-3 w-full rounded-lg" />}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
