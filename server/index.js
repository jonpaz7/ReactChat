import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import usersRouter from "./routes/users.js";
import chatsRouter from "./routes/chats.js";
import messagesRouter from "./routes/messages.js";
import chatHandler from "./sockets/chatHandler.js";

const app = express();
const server = http.createServer(app);

// Attach Socket.IO to the HTTP server with open CORS for local development
const io = new Server(server, { cors: { origin: "*" } });

// Make io accessible inside route handlers via req.app.get("io")
app.set("io", io);

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── REST API Routes ──────────────────────────────────────────────────────────
app.use("/api/users", usersRouter);
app.use("/api/chats", chatsRouter);
app.use("/api/messages", messagesRouter);

// ─── Socket.IO Events ─────────────────────────────────────────────────────────
io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  chatHandler(io, socket);

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
