import { createFileRoute } from "@tanstack/react-router";
import UserToolbar from "../views/room/UserToolbar";
import usePartySocket from "partysocket/react";
import { useState } from "react";
import { FromServerSocketMessage } from "../../isomophic-src/isomorphic";
import UserMessage from "../views/room/UserMessage";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [images, setImages] = useState<string[]>([]);

  usePartySocket({
    host: window.location.host,
    room: "room-1",
    party: "chat",
    onMessage(event) {
      const data: FromServerSocketMessage = JSON.parse(event.data);
      switch (data.type) {
        case "svg_uploaded":
          setImages((prev) => [...prev, data.svgPath]);
          break;
      }
    },
  });

  return (
    <div className="p-2 font-awexbmp">
      <h3 className="">Welcome Home!</h3>
      <ul> 
        {images.map((image, index) => (
          <UserMessage name="frogboi" hat="/BucketHatP.png" frog="Frog1AP.png" image={image} />
        ))}
      </ul>
      <UserToolbar />
    </div>
  );
}
