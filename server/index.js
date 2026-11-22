import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import usersRouter from "./routes/users.js";
import chatsRouter from "./routes/chats.js";
import messagesRouter from "./routes/messages.js";
import chatHandler from "./sockets/chatHandler.js";

// Initialize Express application and HTTP server
const app = express();
const server = http.createServer(app);

// Initialize Socket.io instance with CORS enabled for all origins
const io = new Server(server, { cors: { origin: "*" } });

// Attach socket.io instance to the app so routes can access it via req.app.get("io")
app.set("io", io);

// Middleware configuration
app.use(cors());
app.use(express.json());

// API route handlers
app.use("/api/users", usersRouter);
app.use("/api/chats", chatsRouter);
app.use("/api/messages", messagesRouter);

// Socket.io connection lifecycle handling
io.on("connection", (socket) => {
  console.log(`user ${socket.id} got connected`);

  chatHandler(io, socket);

  socket.on("disconnect", () => {
    console.log(`user got disconnected`);
  });
});

// Start the server listener on specified port
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`The Server is running on http://localhost:${PORT}`);
});
