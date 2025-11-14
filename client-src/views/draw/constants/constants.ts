import { PartySocket } from "partysocket";

export const socket = new PartySocket({
    host: window.location.host,
    party: "chat",
    room: "test"
});
