import { Hono } from "hono";
import { partyserverMiddleware } from "hono-party";
import { Server } from "partyserver";

import type { Connection, WSMessage } from "partyserver";

import { FromClientSocketMessage } from "../isomophic-src/isomorphic";

// Multiple party servers
export class Chat extends Server {
  async onMessage(_connection: Connection, message: WSMessage): Promise<void> {
    const data = JSON.parse(message.toString()) as FromClientSocketMessage;

    switch (data.type) {
      case "upload-svg": {
        await this.ctx.storage.put("value", '123');

        const val = await this.ctx.storage.get<string>("value");       

        this.broadcast(JSON.stringify({
          type: "acknowledge",
          message: `SVG received and stored with value: ${val}`,
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
