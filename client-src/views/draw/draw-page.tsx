import * as React from 'react'
import { Editor } from './components/editor'
import { Controls } from './components/controls'
import { Panel } from './components/panel'
import { useKeyboardShortcuts } from './hooks'

export function DrawPage() {
  useKeyboardShortcuts()

  return (
    <div className="app">
      <Editor />
      <Controls />
      <Panel />
    </div>
  )
}