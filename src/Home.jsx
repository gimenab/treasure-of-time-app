import { closeCard, pickCard } from './cards.js'
import { copy } from './copy.js'
import Notice from './Notice.jsx'
import TakeTime from './TakeTime.jsx'
import Today from './Today.jsx'

// Home (B-07): "Your treasure" in short, at most one card, and today's list.
// No streaks, nothing that resets, no random rewards, no weekly targets (C-09).
export default function Home({ state, setState, dayKey, onOpenTreasure }) {
  const t = copy.home
  const card = pickCard(state, dayKey)
  const close = (id) => setState((s) => closeCard(s, id, dayKey))

  return (
    <div>
      <button
        onClick={onOpenTreasure}
        className="flex w-full items-center justify-between rounded-2xl bg-white px-5 py-4 text-left shadow-sm"
      >
        <span>
          <span className="block text-sm text-muted">{t.treasure}</span>
          <span className="text-3xl font-semibold text-gold">{t.minutes(state.treasure)}</span>
        </span>
        <span className="text-sm text-muted underline">{t.open}</span>
      </button>
      <TakeTime state={state} setState={setState} />

      {card === 'notice' && (
        <div className="mt-6">
          <Notice onOk={() => close('notice')} />
        </div>
      )}

      <Today state={state} setState={setState} dayKey={dayKey} />
    </div>
  )
}
