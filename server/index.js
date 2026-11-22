import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import usersRouter from "./routes/users.js";
import chatsRouter from "./routes/chats.js";
import messagesRouter from "./routes/messages.js";
import authHandlers from "./sockets/authHandler.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.set("io", io);
app.use(cors());
app.use(express.json());
app.use("/api/users", usersRouter);
app.use("/api/chats", chatsRouter);
app.use("/api/messages", messagesRouter);

io.on("connection", (socket) => {
  console.log(`user ${socket.id} got connected`);

  authHandlers(io, socket);

  socket.on("disconnect", () => {
    console.log(`user got disconnected`);
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`The Server is running on http://localhost:${PORT}`);
});
