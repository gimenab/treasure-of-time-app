import { useEffect, useState } from 'react'
import { todayKey } from './date.js'
import { loadState, saveState } from './storage.js'
import Notice from './Notice.jsx'
import Setup from './Setup.jsx'
import Home from './Home.jsx'

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

export default function App() {
  const [state, setState] = useState(loadState)
  const dayKey = useDayKey()

  useEffect(() => {
    saveState(state)
  }, [state])

  const update = (patch) => setState((s) => ({ ...s, ...patch }))

  return (
    <main className="mx-auto min-h-dvh max-w-md px-4 pb-10 pt-6">
      {!state.noticeSeen && <Notice onOk={() => update({ noticeSeen: true })} />}
      {state.setupDone ? (
        <Home state={state} setState={setState} dayKey={dayKey} />
      ) : (
        <Setup onDone={(tasks) => update({ tasks, setupDone: true })} />
      )}
    </main>
  )
}
