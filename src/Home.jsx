import { copy } from './copy.js'
import Today from './Today.jsx'

// Home: "Your treasure" on top and today's list. B-07 adds the one-card-per-opening rule.
export default function Home({ state, setState, dayKey }) {
  const t = copy.home
  return (
    <div>
      <section className="rounded-2xl bg-white p-5 text-center shadow-sm">
        <p className="text-sm text-muted">{t.treasure}</p>
        <p className="mt-1 text-4xl font-semibold text-gold">{t.minutes(state.treasure)}</p>
      </section>
      <Today state={state} setState={setState} dayKey={dayKey} />
    </div>
  )
}
