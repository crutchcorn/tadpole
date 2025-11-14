import * as React from 'react'
import styles from './panel.module.css'
import { app, useAppState } from '../../state'
import { GitHubLogoIcon, HamburgerMenuIcon } from '@radix-ui/react-icons'

export function Panel() {
  const tool = useAppState((s) => s.appState.tool)

  return (
    <>
      <div
        className={[styles.container, styles.bottom, styles.right].join(' ')}
      >
        <button onClick={app.undo}>Undo</button>
        <button onClick={app.redo}>Redo</button>
        <button onClick={app.resetDoc}>Clear</button>
      </div>
    </>
  )
}
