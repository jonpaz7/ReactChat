import { io } from "socket.io-client";

// Backend server connection URL
const SERVER_URL = "http://localhost:5000";

// Shared Socket.io client instance
export const socket = io(SERVER_URL);
