import { Hono } from "hono";
import { partyserverMiddleware } from "hono-party";
import { Server } from "partyserver";

import type { Connection, WSMessage } from "partyserver";

import { FromClientSocketMessage, FromServerSocketMessage } from "../isomophic-src/isomorphic";

function getMessageForClient(data: FromServerSocketMessage): string {
  return JSON.stringify(data);
}

// Multiple party servers
export class Chat extends Server {
  async onMessage(_connection: Connection, message: WSMessage): Promise<void> {
    const data = JSON.parse(message.toString()) as FromClientSocketMessage;

    switch (data.type) {
      case "upload-svg": {
        const svgContent = data.svg;

        const svgFileName = `drawing-${crypto.randomUUID()}.svg`;

        await (this.env as Cloudflare.Env).DRAWINGS_BUCKET.put(svgFileName, svgContent, {
          httpMetadata: {
            contentType: "image/svg+xml",
          },
        });

        this.broadcast(getMessageForClient({
          type: "svg_uploaded",
          svgPath: `https://drawings.tadpole.social/${svgFileName}`,
        }));
        break;
      }
      case "ribbit": {
        this.broadcast(getMessageForClient({
          type: "ribbit_sent",
          name: data.name
        }));
      }
    }
  }
}

const app = new Hono();
app.use("*", partyserverMiddleware());

app.get("/", (c) => c.text("Hello from Hono!"));

export default app;
