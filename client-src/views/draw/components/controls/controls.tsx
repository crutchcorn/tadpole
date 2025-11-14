import * as React from 'react'
import { Colors } from 'components/colors'
import { Checkbox } from 'components/checkbox'
import { Slider } from 'components/slider'
import styles from './controls.module.css'
import { app, useAppState } from 'state'
import type { State } from 'types'

const COLORS = [
  '#000000',
  '#ffc107',
  '#ff5722',
  '#e91e63',
  '#673ab7',
  '#00bcd4',
  '#efefef',
]

const appStateSelector = (s: State) => s.appState

export function Controls() {
  const appState = useAppState(appStateSelector)
  const { style } = appState

  const handleSizeChangeStart = React.useCallback(() => {
    app.setSnapshot()
  }, [])

  const handleSizeChange = React.useCallback((v: number[]) => {
    app.patchStyle({ size: v[0] })
  }, [])

  const handleStrokeWidthChangeStart = React.useCallback(() => {
    app.setSnapshot()
  }, [])

  const handleStrokeWidthChange = React.useCallback((v: number[]) => {
    app.patchStyle({ strokeWidth: v[0] })
  }, [])

  const handleIsFilledChange = React.useCallback(
    (v: boolean | 'indeterminate') => {
      app.setNextStyleForAllShapes({ isFilled: !!v })
    },
    []
  )

  const handleStyleChangeComplete = React.useCallback(() => {
    app.finishStyleUpdate()
  }, [])

  const handleStrokeColorChange = React.useCallback((color: string) => {
    app.patchStyle({ stroke: color })
  }, [])

  const handleFillColorChange = React.useCallback((color: string) => {
    app.patchStyle({ fill: color })
  }, [])

  // Resets

  const handleResetSize = React.useCallback(() => {
    app.resetStyle('size')
  }, [])

  const handleResetStrokeWidth = React.useCallback(() => {
    app.resetStyle('strokeWidth')
  }, [])

  return (
    <div
      className={[
        styles.container,
        appState.isPanelOpen ? styles.open : '',
      ].join(' ')}
    >
      <div className={styles.inputs}>
        <Slider
          name="Size"
          value={[style.size]}
          min={1}
          max={100}
          step={1}
          onDoubleClick={handleResetSize}
          onValueChange={handleSizeChange}
          onPointerDown={handleSizeChangeStart}
          onPointerUp={handleStyleChangeComplete}
        />
        <Colors
          name=""
          color={style.fill}
          colors={COLORS}
          onChange={handleFillColorChange}
        />
        <Slider
          name="Stroke"
          value={[style.strokeWidth]}
          min={0}
          max={100}
          step={1}
          onDoubleClick={handleResetStrokeWidth}
          onValueChange={handleStrokeWidthChange}
          onPointerDown={handleStrokeWidthChangeStart}
          onPointerUp={handleStyleChangeComplete}
        />
        {style.strokeWidth > 0 && (
          <Colors
            name=""
            color={style.stroke}
            colors={COLORS}
            onChange={handleStrokeColorChange}
          />
        )}
      </div>
      <hr />
      <div className={styles.buttonsRow}>
        <button className={styles.rowButton} onClick={app.resetStyles}>
          Reset Options
        </button>
        <button className={styles.rowButton} onClick={app.copyStyles}>
          Copy Options
        </button>
      </div>
      <hr />
      <div className={styles.buttonsRow}>
        <button className={styles.rowButton} onClick={app.copySvg}>
          Copy to SVG
        </button>
      </div>
    </div>
  )
}
