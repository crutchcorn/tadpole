import { useState } from "react";
import { Controls } from "../draw/components/controls";
import { Editor } from "../draw/components/editor";

export default function UserToolbar() {
  const [name, setName] = useState("frogboi");

  return (
    <menu className="flex gap-8 border-8 border-double border-green-800 p-3 bg-green-500/30 backdrop-blur-lg">
      <div className="flex flex-col gap-2 items-center justify-center">
        <span className="relative size-56 border-2 rounded p-2 border-green-800 pixelate backdrop-blur-lg">
          <img src="/Frog1AP.png" className="" />
          <img src="/TopHatP.png" className="absolute top-4 left-17 w-16" />
        </span>
        <input 
          name="name" 
          type="text" 
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          className="text-lg text-center w-fit border-2 border-green-800 bg-white font-bold rounded pl-2" 
        />
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
  );
}
