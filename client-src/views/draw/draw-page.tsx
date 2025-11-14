import { Editor } from "./components/editor";
import { Controls } from "./components/controls";
import { useKeyboardShortcuts } from "./hooks";
import { app } from "./state";
import { socketSend } from "./services/socket";

export function DrawPage() {
  useKeyboardShortcuts();

  return (
    <div
      className="w-full"
      style={{ display: "flex", flexDirection: "row", gap: "1rem" }}
    >
      <div style={{ width: "fit-content" }}>
        <Controls />
      </div>
      <div className={`h-60 flex-grow`}>
        <Editor />
      </div>
      <button onClick={
        () => {
          socketSend({svg: app.copySvg(), type: "upload-svg"});
        }
      }>Send</button>
    </div>
  );
}
