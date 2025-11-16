import { RefObject, useMemo, useRef, useState, useEffect } from "react";
import { Controls } from "../controls";
import { Editor } from "../editor";
import { HATS, REVERSE_HAT_MAP } from "../../constants/hats.ts";
import { FROGS, REVERSE_FROG_MAP } from "../../constants/frogs.ts";
import { socketSend } from "../../services/socket.ts";
import { app } from "../../state";

const EditPencil = `/StreamlineFreehand-EditPencil.svg`;

interface UserToolbarProps {
  hat: string;
  frog: string;
  setFrog: (value: string) => void;
  setHat: (value: string) => void;
  name: string;
  setName: (value: string) => void;
}

export default function UserToolbar({
  hat,
  frog,
  setFrog,
  setHat,
  name,
  setName,
}: UserToolbarProps) {
  const customizeDialogRef = useRef<HTMLDialogElement>(null);

  // Debounce effect - sends name after 500ms of no changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      socketSend({ type: "change-name", name });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [name]);

  // Handler for blur event
  const handleNameBlur = () => {
    socketSend({ type: "change-name", name });
  };

  return (
    <>
      <CustomizeFrogDialog
        hat={hat}
        frog={frog}
        dialogRef={customizeDialogRef}
        onFrogComplete={(frog: string) => setFrog(frog)}
        onHatComplete={(hat: string) => setHat(hat)}
      />
      <menu className="flex gap-8 border-8 border-double border-green-800 p-3 bg-green-500/30 backdrop-blur-lg">
        <div className="flex flex-col gap-2 items-center justify-center">
          <span className="relative size-56 border-2 rounded p-2 border-green-800 pixelate backdrop-blur-lg">
            <img src={hat} className="absolute top-0 left-17 w-16" />
            <img src={frog} className="" />
          </span>
          <input
            name="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            onBlur={handleNameBlur}
            className="text-lg text-center w-fit border-2 border-green-800 bg-white font-bold rounded pl-2"
          />
          <button
            onClick={() => customizeDialogRef.current?.showModal()}
            className="border group bg-green-400 hover:bg-green-600 p-2 rounded-full"
          >
            <img src={EditPencil} className="group-hover:text-green-300" />
          </button>
        </div>

        <div className="w-full max-w-1/6 h-auto border rounded bg-green-500/30">
          <Controls />
        </div>
        <div className="w-full h-auto border rounded bg-white">
          <Editor />
        </div>

        <div className="font-bold text-green-800 flex flex-col justify-center gap-4 w-full max-w-50 h-auto text-4xl">
          <button
            onClick={() => {
              socketSend({ svg: app.copySvg(), type: "upload-svg" });
            }}
            className="w-full bg-green-400 hover:bg-green-600 hover:text-green-300 border-2 border-green-800 rounded p-4"
          >
            Send
          </button>
          <button
            onClick={() => {
              socketSend({ type: "ribbit", name });
            }}
            className="w-full bg-green-400 hover:bg-green-600 hover:text-green-300 border-2 border-green-800 rounded p-4"
          >
            Ribbit
          </button>
        </div>
      </menu>
    </>
  );
}

type CustomizeFrogDialogProps = {
  dialogRef: RefObject<HTMLDialogElement | null>;
  frog: string;
  hat: string;
  onFrogComplete: (frog: string) => void;
  onHatComplete: (hat: string) => void;
};

function CustomizeFrogDialog({
  dialogRef,
  frog,
  hat,
  onFrogComplete,
  onHatComplete,
}: CustomizeFrogDialogProps) {
  const [_hatIndex, setHatIndex] = useState(null as number | null);
  const [_frogIndex, setFrogIndex] = useState(null as number | null);

  const currentHat = useMemo(
    () => (_hatIndex !== null ? HATS[_hatIndex]! : hat),
    [_hatIndex, hat],
  );
  const currentFrog = useMemo(
    () => (_frogIndex !== null ? FROGS[_frogIndex]! : frog),
    [_frogIndex, frog],
  );

  function safeSetHatIndex(fn: (v: number) => number) {
    setHatIndex((v) => {
      const index = fn(v ?? HATS.findIndex((h) => h === hat) ?? 0);
      if (index < 0) return HATS.length - 1;
      if (index >= HATS.length) return 0;
      return index;
    });
  }

  function safeSetFrogIndex(fn: (v: number) => number) {
    setFrogIndex((v) => {
      const index = fn(v ?? FROGS.findIndex((f) => f === frog) ?? 0);
      if (index < 0) return FROGS.length - 1;
      if (index >= FROGS.length) return 0;
      return index;
    });
  }

  return (
    <dialog ref={dialogRef} className="bg-white absolute p-4">
      <div className="flex justify-between items-center">
        <button
          onClick={() => safeSetHatIndex((v) => v - 1)}
          className="border group bg-green-400 hover:bg-green-600 p-2 rounded-full"
        >
          <img src={EditPencil} className="group-hover:text-green-300" />
        </button>
        <img src={currentHat} className="" />
        <button
          onClick={() => safeSetHatIndex((v) => v + 1)}
          className="border group bg-green-400 hover:bg-green-600 p-2 rounded-full"
        >
          <img src={EditPencil} className="group-hover:text-green-300" />
        </button>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={() => safeSetFrogIndex((v) => v - 1)}
          className="border group bg-green-400 hover:bg-green-600 p-2 rounded-full"
        >
          <img src={EditPencil} className="group-hover:text-green-300" />
        </button>
        <img src={currentFrog} className="" />
        <button
          onClick={() => safeSetFrogIndex((v) => v + 1)}
          className="border group bg-green-400 hover:bg-green-600 p-2 rounded-full"
        >
          <img src={EditPencil} className="group-hover:text-green-300" />
        </button>
      </div>

      <button
        onClick={() => {
          onFrogComplete(currentFrog);
          onHatComplete(currentHat);
          setFrogIndex(null);
          setHatIndex(null);
          socketSend({
            type: "change-frog",
            frog: REVERSE_FROG_MAP[currentFrog] as never,
            hat: REVERSE_HAT_MAP[currentHat] as never,
          });
          dialogRef.current?.close();
        }}
      >
        Confirm
      </button>
    </dialog>
  );
}
