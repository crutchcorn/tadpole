import * as React from "react";
import { Colors } from "../colors";
import { Checkbox } from "../checkbox";
import { Slider } from "../slider";
import styles from "./controls.module.css";
import { app, useAppState } from "../../state";
import type { State } from "../../state/state";
import { useControls, COLORS } from "./use-controls";

export function Controls() {
  const {
    isPanelOpen,
    handleSizeChangeStart,
    handleSizeChange,
    handleStrokeWidthChangeStart,
    handleStrokeWidthChange,
    handleIsFilledChange,
    handleStyleChangeComplete,
    handleStrokeColorChange,
    handleFillColorChange,
    style,
  } = useControls();

  return (
    <div
      className={[styles.container, isPanelOpen ? styles.open : ""].join(" ")}
    >
      <div className={styles.inputs}>
        <Slider
          name="Size"
          value={[style.size]}
          min={1}
          max={100}
          step={1}
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
      <div style={{display: 'flex', gap: '1rem'}}>
        <button onClick={app.undo}>Undo</button>
        <button onClick={app.redo}>Redo</button>
        <button onClick={app.resetDoc}>Clear</button>
      </div>
    </div>
  );
}
