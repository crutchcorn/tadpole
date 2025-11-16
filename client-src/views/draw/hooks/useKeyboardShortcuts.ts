import { useHotkeys } from "react-hotkeys-hook";
import { app } from "../state";

export function useKeyboardShortcuts() {
  useHotkeys("meta+z,ctrl+z", () => {
    app.undo();
  });

  useHotkeys("meta+shift+z,ctrl+shift+z", () => {
    app.redo();
  });

  useHotkeys("e,backspace", () => {
    app.resetDoc();
  });
}
