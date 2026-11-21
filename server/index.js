import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import messagesRouter, { addMessage } from "./routes/messages.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", messagesRouter);
app.use("/api/chats", messagesRouter);
app.use("/api/messages", messagesRouter);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log(`user ${socket.id} got connected`);

  socket.on("send_message", (data) => {
    addMessage(data);

    io.emit("receive_message", "got it");
  });

  socket.on("disconnect", () => {
    console.log(`user got disconnected`);
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`The Server is running on http://localhost:${PORT}`);
});
