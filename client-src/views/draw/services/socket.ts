import { FromClientSocketMessage, FromServerSocketMessage } from "../../../../isomophic-src/isomorphic";
import { socket } from "../constants/constants";

export function socketSend(type: FromClientSocketMessage) {
    socket.send(JSON.stringify(type));
}

socket.addEventListener('message', (event) => {
    const data: FromServerSocketMessage = JSON.parse(event.data);
    console.log({ data });
});