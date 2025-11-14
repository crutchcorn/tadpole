import * as React from "react";
import { Editor } from "./components/editor";
import { Controls } from "./components/controls";
import { useKeyboardShortcuts } from "./hooks";

export function DrawPage() {
  useKeyboardShortcuts();

  return (
    <div>
      <div className={`w-full h-60`}>
        <Editor />
      </div>
      <Controls />
    </div>
  );
}
