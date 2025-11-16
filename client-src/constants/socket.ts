import { createContext } from "react";
import PartySocket from "partysocket";

export const SocketContext = createContext<PartySocket>(null!);