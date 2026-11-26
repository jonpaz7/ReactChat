import express from "express";
import * as store from "../data/store.js";

const router = express.Router();

// GET /api/chats — return all stored chats
router.get("/", async (req, res) => {
  res.json(await store.getAllChats());
});

// POST /api/chats/create — find or create a chat between two users
router.post("/create", async (req, res) => {
  try {
    const { chat, isNew } = await store.getOrCreateChat(req.body);

    if (isNew) {
      // Notify all clients only when a brand new chat is created
      const io = req.app.get("io");
      io.emit("chat_created", chat);
    }

    res.status(201).json(chat);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
