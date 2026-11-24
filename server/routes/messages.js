import express from "express";
import * as store from "../data/store.js";

const router = express.Router();

// GET /api/messages - Fetch all stored messages
router.get("/", (req, res) => {
  res.json(store.getMessagesData());
});

router.post("/send", (req, res) => {
  try {
    const newMessage = store.sendMessage(req.body);

    const io = req.app.get("io");
    const chat = store.getChatById(req.body.chatId);

    const chatParticipants = [...new Set(chat.participants)];
    chatParticipants.forEach((pid) => {
      io.to(pid).emit("new_message", newMessage);
    });

    res.status(201).json("");
  } catch (err) {
    console.log(err);
    res.status(400);
  }
});

router.post("/edit", (req, res) => {
  try {
    const editedMessage = store.editMessage(req.body);

    const io = req.app.get("io");

    const chat = store.getChatById(req.body.chatId);
    const chatParticipants = [...new Set(chat.participants)];

    chatParticipants.forEach((pid) => {
      io.to(pid).emit("message_edited", editedMessage);
    });

    res.status(201).json("");
  } catch (err) {
    console.log(err);
    res.status(400);
  }
});

router.post("/delete", (req, res) => {
  try {
    const { deletedMessage, deleteMode } = store.deleteMessage(req.body);

    const io = req.app.get("io");
    const chat = store.getChatById(req.body.chatId);

    const chatParticipants = [...new Set(chat.participants)];

    chatParticipants.forEach((pid) => {
      io.to(pid).emit("message_deleted", { deletedMessage, deleteMode });
    });

    res.status(201).json(" ");
  } catch (err) {
    console.log(err);
    res.status(400).json(" ");
  }
});

export default router;
