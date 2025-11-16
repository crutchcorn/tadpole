import { Hono } from "hono";
import { partyserverMiddleware } from "hono-party";
import { Server } from "partyserver";

import type { Connection, WSMessage } from "partyserver";

import { FromClientSocketMessage, FromServerSocketMessage, Frog, Hat, DEFAULT_NAME } from "../isomophic-src/isomorphic";

function getMessageForClient(data: FromServerSocketMessage): string {
  return JSON.stringify(data);
}

// Multiple party servers
export class Chat extends Server {
  async onMessage(connection: Connection, message: WSMessage): Promise<void> {
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

        const hat = await this.ctx.storage.get<Hat>("hat") || "";
        const frog = await this.ctx.storage.get<Frog>("frog") || "Frog1AP";
        const name = await this.ctx.storage.get<string>("name") || DEFAULT_NAME;

        this.broadcast(getMessageForClient({
          type: "svg_uploaded",
          hat,
          userId: connection.id,
          frog,
          name,
          svgPath: `https://drawings.tadpole.social/${svgFileName}`,
        }));
        break;
      }
      case "ribbit": {
        this.broadcast(getMessageForClient({
          type: "ribbit_sent",
          name: data.name
        }));
        break;
      }
      case "request-frog": {
        const hat = await this.ctx.storage.get<Hat>("hat") || "";
        const frog = await this.ctx.storage.get<Frog>("frog") || "Frog1AP";
        const name = await this.ctx.storage.get<string>("name") || DEFAULT_NAME;
        connection.send(getMessageForClient({
          type: "get_frog",
          hat,
          frog,
          name,
          userId: connection.id,
        }));
        break;
      }
      case "change-frog": {
        this.ctx.storage.put("hat", data.hat);
        this.ctx.storage.put("frog", data.frog);
        const name = await this.ctx.storage.get<string>("name") || DEFAULT_NAME;
        this.broadcast(getMessageForClient({
          type: "frog_changed",
          hat: data.hat,
          userId: connection.id,
          frog: data.frog,
          name,
        }));
        break;
      }
      case "change-name": {
        this.ctx.storage.put("name", data.name);
        this.broadcast(getMessageForClient({
          type: "name_changed",
          userId: connection.id,
          name: data.name,
        }));
        break;
      }
    }
  }
}

const app = new Hono();
app.use("*", partyserverMiddleware());

app.get("/", (c) => c.text("Hello from Hono!"));

export default app;
