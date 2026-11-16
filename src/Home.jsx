import { copy } from './copy.js'

// Placeholder home until B-04 (daily list) and B-07 ("Your treasure" + one card).
export default function Home({ state }) {
  const t = copy.home
  return (
    <div>
      <section className="rounded-2xl bg-white p-5 text-center shadow-sm">
        <p className="text-sm text-muted">{t.treasure}</p>
        <p className="mt-1 text-4xl font-semibold text-gold">{t.minutes(state.treasure)}</p>
      </section>

      <h2 className="mt-8 font-semibold">{t.yourTasks}</h2>
      <ul className="mt-2 divide-y divide-ink/10 rounded-2xl bg-white shadow-sm">
        {state.tasks.map((task) => (
          <li key={task.id} className="flex justify-between px-4 py-3">
            <span>{task.title}</span>
            <span className="text-muted">{copy.min(task.minutes)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm text-muted">{t.comingSoon}</p>
    </div>
  )
}
