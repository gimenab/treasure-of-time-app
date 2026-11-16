import { useEffect, useState } from 'react'
import { loadState, saveState } from './storage.js'
import Notice from './Notice.jsx'
import Setup from './Setup.jsx'
import Home from './Home.jsx'

export default function App() {
  const [state, setState] = useState(loadState)

  useEffect(() => {
    saveState(state)
  }, [state])

  const update = (patch) => setState((s) => ({ ...s, ...patch }))

  return (
    <main className="mx-auto min-h-dvh max-w-md px-4 pb-10 pt-6">
      {!state.noticeSeen && <Notice onOk={() => update({ noticeSeen: true })} />}
      {state.setupDone ? (
        <Home state={state} />
      ) : (
        <Setup onDone={(tasks) => update({ tasks, setupDone: true })} />
      )}
    </main>
  )
}
