import { RefObject, useMemo, useRef, useState } from "react";
import { Controls } from "../draw/components/controls";
import { Editor } from "../draw/components/editor";
import { HATS, REVERSE_HAT_MAP } from "./state/hats";
import { FROGS, REVERSE_FROG_MAP } from "./state/frogs";
import { socketSend } from "../draw/services/socket";
import { app } from "../draw/state";

const EditPencil = `/StreamlineFreehand-EditPencil.svg`;

interface UserToolbarProps {
  hat: string;
  frog: string;
  setFrog: (value: string) => void;
  setHat: (value: string) => void;
}

export default function UserToolbar({
  hat,
  frog,
  setFrog,
  setHat,
}: UserToolbarProps) {
  const [name, setName] = useState("frogboi");
  const ribbitRef = useRef<HTMLAudioElement>(null);
  const customizeDialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <audio ref={ribbitRef} src="/ribbit.mp3"></audio>
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
              ribbitRef.current?.play();
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
