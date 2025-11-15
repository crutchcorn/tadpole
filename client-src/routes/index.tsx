import { createFileRoute } from "@tanstack/react-router";
import UserToolbar from "../views/room/UserToolbar";
import usePartySocket from "partysocket/react";
import { useEffect, useRef, useState } from "react";
import { Frog, FromServerSocketMessage, Hat, SVGUploaded } from "../../isomophic-src/isomorphic";
import UserMessage from "../views/room/UserMessage";
import { HAT_MAP, HATS, REVERSE_HAT_MAP } from "../views/room/state/hats";
import { FROG_MAP, FROGS, REVERSE_FROG_MAP } from "../views/room/state/frogs";
import { socketSend } from "../views/draw/services/socket";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [messages, setMessages] = useState<SVGUploaded[]>([]);
  const [userMap, setUserMap] = useState({} as Record<string, { frog: Frog, hat: Hat }>);
  const [hat, setHat] = useState("/TopHatP.png");
  const [frog, setFrog] = useState("/Frog1AP.png");

  usePartySocket({
    host: window.location.host,
    room: "room-1",
    party: "chat",
    onMessage(event) {
      const data: FromServerSocketMessage = JSON.parse(event.data);
      switch (data.type) {
        case "svg_uploaded": {
          setMessages((prev) => [...prev, data]);
          setUserMap((prev) => ({
            ...prev,
            [data.userId]: { frog: data.frog, hat: data.hat },
          }));
          break;
        }
        case "frog_changed": {
          setUserMap((prev) => ({
            ...prev,
            [data.userId]: { frog: data.frog, hat: data.hat },
          }));
          break;
        }
        case "get_frog": {
          setHat(HAT_MAP[data.hat]!);
          setFrog(FROG_MAP[data.frog]!);
          break;
        }
      }
    },
  });

  useEffect(() => {
    socketSend({ type: "request-frog" });
  }, []);

  return (
    <div className="p-2 font-awexbmp h-screen flex flex-col">
      <ul className="flex-1 overflow-auto mb-0">
        {messages.map((message) => (
          <UserMessage name="frogboi" hat={HAT_MAP[userMap[message.userId]!.hat]!} frog={FROG_MAP[userMap[message.userId]!.frog]!} image={message.svgPath} />
        ))}
      </ul>
      <div className="sticky bottom-0">
        <UserToolbar hat={hat}
          frog={frog}
          setFrog={setFrog}
          setHat={setHat} />
      </div>
    </div>
  );
}
