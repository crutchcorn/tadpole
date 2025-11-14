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
    handleSizeChangeStart,
    handleSizeChange,
    handleStrokeWidthChangeStart,
    handleStrokeWidthChange,
    handleStyleChangeComplete,
    handleStrokeColorChange,
    handleFillColorChange,
    style,
  } = useControls();

  return (
    <div className={"flex flex-col gap-1 p-3 justify-center"}>
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
          defaultValue={[2]}
          onValueChange={handleStrokeWidthChange}
          onPointerDown={handleStrokeWidthChangeStart}
          onPointerUp={handleStyleChangeComplete}
        />
        <Colors
          name=""
          color={style.stroke}
          colors={COLORS}
          onChange={handleStrokeColorChange}
        />
      <div className="flex gap-2 items-center justify-center">
        <button onClick={app.undo} className="border-2 border-green-800 rounded hover:text-green-300 hover:bg-green-600 px-2 py-1 bg-green-400 text-green-800">Undo</button>
        <button onClick={app.redo} className="border-2 border-green-800 rounded hover:text-green-300 hover:bg-green-600 px-2 py-1 bg-green-400 text-green-800">Redo</button>
        <button onClick={app.resetDoc} className="border-2 border-green-800 rounded hover:text-green-300 hover:bg-green-600 px-2 py-1 bg-green-400 text-green-800">Clear</button>
      </div>
    </div>
  );
}
