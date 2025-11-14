import { RefObject, useEffect, useMemo, useRef, useState } from "react";
import { Controls } from "../draw/components/controls";
import { Editor } from "../draw/components/editor";
import EditPencil from "/StreamlineFreehand-EditPencil.svg" with { type: "svg" };
import { HATS } from "./state/hats";
import { FROGS } from "./state/frogs";

export default function UserToolbar() {
  const [name, setName] = useState("frogboi");
  const [hat, setHat] = useState("/TopHatP.png");
  const [frog, setFrog] = useState("/Frog1AP.png");
  const customizeDialogRef = useRef<HTMLDialogElement>(null);

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
            className="text-lg text-center w-fit border-2 border-green-800 bg-white font-bold rounded pl-2" 
          />
          <button onClick={() => customizeDialogRef.current?.showModal()} className="border group bg-green-400 hover:bg-green-600 p-2 rounded-full">
            <img src={EditPencil} className="group-hover:text-green-300"/> 
          </button>
        </div> 

        <div className="w-full max-w-1/6 h-auto border rounded bg-green-500/30">
          <Controls />
        </div>
        <div className="w-full h-auto border rounded bg-white">
          <Editor />
        </div>

        <div className="font-bold text-green-800 flex flex-col justify-center gap-4 w-full max-w-50 h-auto text-4xl">
          <button className="w-full bg-green-400 hover:bg-green-600 hover:text-green-300 border-2 border-green-800 rounded p-4">Send</button>
          <button className="w-full bg-green-400 hover:bg-green-600 hover:text-green-300 border-2 border-green-800 rounded p-4">Ribbit</button>
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
}

function CustomizeFrogDialog({ dialogRef, frog, hat, onFrogComplete, onHatComplete }: CustomizeFrogDialogProps) {
  const [hatIndex, setHatIndex] = useState(HATS.findIndex((v) => v === hat));
  const [frogIndex, setFrogIndex] = useState(FROGS.findIndex((v) => v === frog));

  useEffect(() => console.log({ hatIndex, HATS, hat }), [hat]);

  const currentHat = useMemo(() => HATS[hatIndex], [hatIndex]);
  const currentFrog = useMemo(() => FROGS[frogIndex], [frogIndex]);

  return (
    <dialog ref={dialogRef} className="bg-white absolute p-4">
      <div className="flex justify-between items-center">
        <button onClick={() => hatIndex === 0 ? setHatIndex(HATS.length - 1) : setHatIndex(hatIndex-1)} className="border group bg-green-400 hover:bg-green-600 p-2 rounded-full">
          <img src={EditPencil} className="group-hover:text-green-300"/> 
        </button>
        <img src={currentHat} className="" />
        <button onClick={() => hatIndex === HATS.length ? setHatIndex(0) : setHatIndex(hatIndex + 1)} className="border group bg-green-400 hover:bg-green-600 p-2 rounded-full">
          <img src={EditPencil} className="group-hover:text-green-300"/> 
        </button>
      </div>

      <div className="flex justify-between items-center">
        <button onClick={() => frogIndex === 0 ? setFrogIndex(HATS.length - 1) : setFrogIndex(frogIndex-1)} className="border group bg-green-400 hover:bg-green-600 p-2 rounded-full">
          <img src={EditPencil} className="group-hover:text-green-300"/> 
        </button>
        <img src={currentFrog} className="" />
        <button onClick={() => frogIndex === HATS.length ? setFrogIndex(0) : setFrogIndex(frogIndex + 1)} className="border group bg-green-400 hover:bg-green-600 p-2 rounded-full">
          <img src={EditPencil} className="group-hover:text-green-300"/> 
        </button>
      </div>

      <button onClick={() => { 
        onFrogComplete(currentFrog); 
        onHatComplete(currentHat); 
        dialogRef.current?.close();
      }}>
        Confirm
      </button>
    </dialog>
  );
}
