import express from "express";
import * as store from "../data/store.js";

const router = express.Router();

// GET /api/chats - Fetch all existing chats
router.get("/", (req, res) => {
  res.json(store.getChatsData());
});

// POST /api/chats/create - Create a new chat and notify connected clients
router.post("/create", (req, res) => {
  try {
    const newChat = store.createChat(req.body);

    const io = req.app.get("io");
    io.emit("chat_created", newChat);
    res.status(201).json(newChat);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
