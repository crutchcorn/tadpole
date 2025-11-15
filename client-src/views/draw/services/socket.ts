import { FromClientSocketMessage, FromServerSocketMessage } from "../../../../isomophic-src/isomorphic";
import { socket } from "../constants/constants";

export function socketSend(type: FromClientSocketMessage) {
    socket.send(JSON.stringify(type));
}
