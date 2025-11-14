import * as React from "react";
import { Colors } from "../colors";
import { Checkbox } from "../checkbox";
import { Slider } from "../slider";
import styles from "./controls.module.css";
import { app, useAppState } from "../../state";
import type { State } from "../../state/state";

export const COLORS = [
  "#000000",
  "#ffc107",
  "#ff5722",
  "#e91e63",
  "#673ab7",
  "#00bcd4",
  "#efefef",
];

const appStateSelector = (s: State) => s.appState;

export function useControls() {
  const appState = useAppState(appStateSelector);
  const { style } = appState;

  const handleSizeChangeStart = React.useCallback(() => {
    app.setSnapshot();
  }, []);

  const handleSizeChange = React.useCallback((v: number[]) => {
    app.patchStyle({ size: v[0] });
  }, []);

  const handleStrokeWidthChangeStart = React.useCallback(() => {
    app.setSnapshot();
  }, []);

  const handleStrokeWidthChange = React.useCallback((v: number[]) => {
    app.patchStyle({ strokeWidth: v[0] });
  }, []);

  const handleIsFilledChange = React.useCallback(
    (v: boolean | "indeterminate") => {
      app.setNextStyleForAllShapes({ isFilled: !!v });
    },
    [],
  );

  const handleStyleChangeComplete = React.useCallback(() => {
    app.finishStyleUpdate();
  }, []);

  const handleStrokeColorChange = React.useCallback((color: string) => {
    app.patchStyle({ stroke: color });
  }, []);

  const handleFillColorChange = React.useCallback((color: string) => {
    app.patchStyle({ fill: color });
  }, []);

  return {
    isPanelOpen: appState.isPanelOpen,
    handleSizeChangeStart,
    handleSizeChange,
    handleStrokeWidthChangeStart,
    handleStrokeWidthChange,
    handleIsFilledChange,
    handleStyleChangeComplete,
    handleStrokeColorChange,
    handleFillColorChange,
    style,
  };
}
