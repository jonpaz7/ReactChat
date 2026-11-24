import { io } from "socket.io-client";
import { SERVER_URL } from "../config.js";

// Create socket instance but delay connection until after user logs in.
// autoConnect: false prevents an anonymous WebSocket from opening before authentication.
export const socket = io(SERVER_URL, { autoConnect: false });
