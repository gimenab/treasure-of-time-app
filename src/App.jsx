import { useCallback, useEffect, useState } from 'react'
import { todayKey } from './date.js'
import { copy } from './copy.js'
import { loadState, saveState } from './storage.js'
import Notice from './Notice.jsx'
import Setup from './Setup.jsx'
import Home from './Home.jsx'
import Timer from './Timer.jsx'
import Moments from './Moments.jsx'
import Treasure, { DataSection, RestoredModal } from './Treasure.jsx'

// Current local day. Re-checked every minute and when the app comes back to the foreground,
// so the list resets at midnight even if the app stays open (B-04).
function useDayKey() {
  const [key, setKey] = useState(todayKey)
  useEffect(() => {
    const check = () => setKey(todayKey())
    const id = setInterval(check, 60_000)
    document.addEventListener('visibilitychange', check)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', check)
    }
  }, [])
  return key
}

// App name on top of every screen (founder's request, 2026-11-18).
function AppName() {
  return <p className="mb-4 text-center font-display text-3xl font-semibold text-accent">{copy.appName}</p>
}

export default function App() {
  const [state, setState] = useState(loadState)
  const dayKey = useDayKey()

  // If the browser runs out of space (photos), say so instead of losing data quietly.
  const [saveFailed, setSaveFailed] = useState(false)
  useEffect(() => {
    // Saving is the external system here; the flag reports whether it worked.
    // oxlint-disable-next-line react/set-state-in-effect
    setSaveFailed(!saveState(state))
  }, [state])

  const [view, setView] = useState('home')
  const [restoredDate, setRestoredDate] = useState(null)
  const closeRestored = useCallback(() => setRestoredDate(null), [])
  // After a restore: straight to the home, with a confirmation that closes on its own.
  const onRestored = (date) => {
    setView('home')
    setRestoredDate(date)
  }
  const update = (patch) => setState((s) => ({ ...s, ...patch }))

  // First visit: the notice sits above the setup. Afterwards it is a card on the home.
  if (!state.setupDone) {
    return (
      <main className="mx-auto min-h-dvh max-w-md px-4 pb-10 pt-6">
        <AppName />
        {!state.noticeSeen && (
          <div className="mb-6">
            <Notice onOk={() => update({ noticeSeen: true })} />
          </div>
        )}
        <Setup
          onDone={(tasks) => {
            update({ tasks, setupDone: true })
            setView('home')
          }}
        />
        <DataSection
          state={state}
          setState={setState}
          dayKey={dayKey}
          onRestored={onRestored}
          firstVisit
        />
      </main>
    )
  }

  return (
    <main className="mx-auto min-h-dvh max-w-md px-4 pb-10 pt-6">
      <AppName />
      {state.timer ? (
        <Timer state={state} setState={setState} dayKey={dayKey} />
      ) : view === 'treasure' ? (
        <Treasure
          state={state}
          setState={setState}
          dayKey={dayKey}
          onBack={() => setView('home')}
          onRestored={onRestored}
        />
      ) : view === 'moments' ? (
        <Moments moments={state.moments} onBack={() => setView('home')} />
      ) : (
        <Home
          state={state}
          setState={setState}
          dayKey={dayKey}
          onOpenTreasure={() => setView('treasure')}
          onOpenMoments={() => setView('moments')}
        />
      )}
      {saveFailed && (
        <p className="mt-6 rounded-2xl border border-accent/30 bg-accent-soft p-4 text-sm">{copy.saveFailed}</p>
      )}
      {restoredDate && <RestoredModal date={restoredDate} onClose={closeRestored} />}
    </main>
  )
}
