import { createFileRoute } from "@tanstack/react-router";
import UserToolbar from "../views/room/UserToolbar";
import usePartySocket from "partysocket/react";
import { useState } from "react";
import { FromServerSocketMessage, SVGUploaded } from "../../isomophic-src/isomorphic";
import UserMessage from "../views/room/UserMessage";
import { HAT_MAP } from "../views/room/state/hats";
import { FROG_MAP } from "../views/room/state/frogs";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [messages, setMessages] = useState<SVGUploaded[]>([]);

  usePartySocket({
    host: window.location.host,
    room: "room-1",
    party: "chat",
    onMessage(event) {
      const data: FromServerSocketMessage = JSON.parse(event.data);
      switch (data.type) {
        case "svg_uploaded":
          setMessages((prev) => [...prev, data]);
          break;
      }
    },
  });

  return (
    <div className="p-2 font-awexbmp">
      <h3 className="">Welcome Home!</h3>
      <ul> 
        {messages.map((message) => (
          <UserMessage name="frogboi" hat={HAT_MAP[message.hat]!} frog={FROG_MAP[message.frog]!} image={message.svgPath} />
        ))}
      </ul>
      <UserToolbar />
    </div>
  );
}
