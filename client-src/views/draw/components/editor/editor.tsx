import * as React from "react";
import { Renderer } from "@tldraw/core";
import { app, useAppState } from "../../state";
import styles from "./editor.module.css";

export function Editor(): JSX.Element {
  const {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    shapeUtils,
  } = app;
  const { page, pageState } = useAppState();

  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.freehand = app;
  }, []);

  return (
    <Renderer
      page={page}
      pageState={pageState}
      shapeUtils={shapeUtils as never}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    />
  );
}
