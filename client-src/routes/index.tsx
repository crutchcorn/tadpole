import { createFileRoute } from "@tanstack/react-router";
import UserToolbar from "../views/room/UserToolbar";
import { useEffect, useState } from "react";
import {
  Frog,
  FromServerSocketMessage,
  Hat,
  SVGUploaded,
  DEFAULT_NAME,
} from "../../isomophic-src/isomorphic";
import UserMessage from "../views/room/UserMessage";
import { HAT_MAP } from "../views/room/state/hats";
import { FROG_MAP } from "../views/room/state/frogs";
import { socketSend } from "../views/draw/services/socket";
import { socket } from "../views/draw/constants/constants";
import { useKeyboardShortcuts } from "../views/draw/hooks";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [messages, setMessages] = useState<SVGUploaded[]>([]);
  const [userMap, setUserMap] = useState(
    {} as Record<string, { frog: Frog; hat: Hat; name: string }>,
  );
  const [hat, setHat] = useState("/TopHatP.png");
  const [frog, setFrog] = useState("/Frog1AP.png");
  const [name, setName] = useState(DEFAULT_NAME);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      const data: FromServerSocketMessage = JSON.parse(event.data);
      switch (data.type) {
        case "svg_uploaded": {
          setMessages((prev) => [...prev, data]);
          setUserMap((prev) => ({
            ...prev,
            [data.userId]: { frog: data.frog, hat: data.hat, name: data.name },
          }));
          break;
        }
        case "frog_changed": {
          setUserMap((prev) => ({
            ...prev,
            [data.userId]: { frog: data.frog, hat: data.hat, name: data.name },
          }));
          break;
        }
        case "get_frog": {
          setHat(HAT_MAP[data.hat]!);
          setFrog(FROG_MAP[data.frog]!);
          setName(data.name);
          break;
        }
        case "name_changed": {
          setUserMap((prev) => ({
            ...prev,
            [data.userId]: { ...prev[data.userId], name: data.name },
          }));
          break;
        }
        case "ribbit_sent": {
          const audio = new Audio("/ribbit.mp3");
          audio.play().catch((err) => console.error("Failed to play ribbit:", err));
          break;
        }
      }
    }

    socket.addEventListener("message", onMessage);
    return () => {
      socket.removeEventListener("message", onMessage);
    };
  }, []);

  useEffect(() => {
    function onOpen() {
      socketSend({ type: "request-frog" });
    }
    socket.addEventListener("open", onOpen);
    onOpen();

    return () => {
      socket.removeEventListener("open", onOpen);
    };
  }, []);

  useKeyboardShortcuts();

  return (
    <div className="p-2 font-awexbmp h-screen flex flex-col">
      <ul className="flex-1 overflow-auto mb-0">
        {messages.map((message, i) => (
          <UserMessage
            key={i}
            name={userMap[message.userId]?.name || DEFAULT_NAME}
            hat={HAT_MAP[userMap[message.userId]!.hat]!}
            frog={FROG_MAP[userMap[message.userId]!.frog]!}
            image={message.svgPath}
          />
        ))}
      </ul>
      <div className="sticky bottom-0">
        <UserToolbar hat={hat} frog={frog} setFrog={setFrog} setHat={setHat} name={name} setName={setName} />
      </div>
    </div>
  );
}
