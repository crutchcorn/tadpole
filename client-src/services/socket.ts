import { FromClientSocketMessage } from "../../isomophic-src/isomorphic.ts";
import { socket } from "../constants/socket.ts";

export function socketSend(type: FromClientSocketMessage) {
    socket.send(JSON.stringify(type));
}
