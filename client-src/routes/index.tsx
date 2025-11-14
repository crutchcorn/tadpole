import { createFileRoute } from "@tanstack/react-router";
import UserToolbar from "../views/room/UserToolbar";
import usePartySocket from "partysocket/react";
import { useRef, useState } from "react";
import { Frog, FromServerSocketMessage, Hat, SVGUploaded } from "../../isomophic-src/isomorphic";
import UserMessage from "../views/room/UserMessage";
import { HAT_MAP } from "../views/room/state/hats";
import { FROG_MAP } from "../views/room/state/frogs";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [messages, setMessages] = useState<SVGUploaded[]>([]);
  const [userMap, setUserMap] = useState({} as Record<string, { frog: Frog, hat: Hat }>);

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
      }
    },
  });

  return (
    <div className="p-2 font-awexbmp">
      <h3 className="">Welcome Home!</h3>
      <ul>
        {messages.map((message) => (
          <UserMessage name="frogboi" hat={HAT_MAP[userMap[message.userId]!.hat]!} frog={FROG_MAP[userMap[message.userId]!.frog]!} image={message.svgPath} />
        ))}
      </ul>
      <UserToolbar />
    </div>
  );
}
