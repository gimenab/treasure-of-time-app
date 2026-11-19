import { useEffect, useState } from 'react'
import { copy } from './copy.js'
import { registerFromTimer, skipFromTimer } from './moments.js'
import Register from './Register.jsx'
import {
  closeTimer,
  leftMs,
  pauseTimer,
  resumeTimer,
  settleTimer,
  stopTimer,
  unusedMinutes,
} from './timer.js'

const t = copy.timer

const clock = (ms) => {
  const s = Math.ceil(ms / 1000)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

// The time being taken (B-09). Replaces the home until it is over.
export default function Timer({ state, setState, dayKey }) {
  const { timer } = state
  const [now, setNow] = useState(Date.now)
  const [asking, setAsking] = useState(false)
  const apply = (fn) => setState((s) => fn(s, Date.now()))

  // Ticks every second and when the app comes back; stops on its own at 0 (row 26).
  useEffect(() => {
    const tick = () => {
      setNow(Date.now())
      setState((s) => settleTimer(s, Date.now()))
    }
    tick()
    const id = setInterval(tick, 1000)
    document.addEventListener('visibilitychange', tick)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', tick)
    }
  }, [setState])

  if (timer.finished) {
    return (
      <section className="mt-10 rounded-2xl bg-card p-6 text-center shadow-sm">
        <h1 className="font-display text-accent text-3xl">{t.doneTitle}</h1>
        <p className="mt-2 text-muted">{t.doneUsed(timer.used)}</p>
        {timer.used > 0 ? (
          <Register
            momentDay={dayKey}
            onRegister={(moment) => setState((s) => registerFromTimer(s, dayKey, moment))}
            onSkip={() => setState((s) => skipFromTimer(s, dayKey))}
          />
        ) : (
          <button
            onClick={() => setState(closeTimer)}
            className="mt-6 w-full rounded-full bg-accent py-2 font-semibold text-paper"
          >
            {t.back}
          </button>
        )}
      </section>
    )
  }

  const paused = timer.leftMs !== null
  const unused = unusedMinutes(timer, now)

  // Stopping early: save the unused minutes only if there are any (row 14).
  const stop = () => {
    if (timer.wildcard) {
      apply((s, n) => stopTimer(s, n, false))
    } else if (unused > 0) {
      apply(pauseTimer)
      setAsking({ wasPaused: paused })
    } else {
      apply((s, n) => stopTimer(s, n, false))
    }
  }
  const answer = (save) => {
    setAsking(false)
    apply((s, n) => stopTimer(s, n, save))
  }
  // Back to the timer as it was: running, or paused if it was paused before.
  const keepGoing = () => {
    if (!asking.wasPaused) apply(resumeTimer)
    setAsking(false)
  }

  return (
    <section className="mt-10 rounded-2xl bg-card p-6 text-center shadow-sm">
      <p className="text-sm text-muted">{timer.wildcard ? t.wildcardTitle : t.title}</p>
      <p className="mt-2 font-display text-6xl tabular-nums text-accent">{clock(leftMs(timer, now))}</p>
      <p className="mt-2 text-sm text-muted">{paused && !asking ? t.paused : t.hint}</p>
      {!asking && (
        <p className="mt-1 text-sm text-muted">
          {timer.wildcard ? t.wildcardBalance : t.balance(state.treasure, unused)}
        </p>
      )}

      {asking ? (
        <div className="mt-6">
          <p>{t.saveQuestion(unused)}</p>
          <p className="mt-1 text-sm text-muted">{t.saveResult(state.treasure + unused)}</p>
          <div className="mt-3 flex flex-col gap-2">
            <button onClick={() => answer(true)} className="rounded-full bg-accent py-2 font-semibold text-paper">
              {t.saveYes}
            </button>
            <button onClick={() => answer(false)} className="rounded-full border border-ink py-2">
              {t.saveNo}
            </button>
            <button onClick={keepGoing} className="text-sm text-muted underline">
              {t.keepGoing}
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-2">
          <button
            onClick={() => apply(paused ? resumeTimer : pauseTimer)}
            className="rounded-full bg-accent py-2 font-semibold text-paper"
          >
            {paused ? t.resume : t.pause}
          </button>
          <button onClick={stop} className="rounded-full border border-ink py-2">
            {t.stop}
          </button>
        </div>
      )}
    </section>
  )
}
