import express from "express";
import * as store from "../data/store.js";

const router = express.Router();

// Helper: emit a socket event to all participants of a given chat
const emitToParticipants = (io, chatId, eventName, payload) => {
  const chat = store.getChatById(chatId);
  if (!chat) return;

  const participantIds = [...new Set(chat.participants)];
  participantIds.forEach((participantId) => {
    io.to(participantId).emit(eventName, payload);
  });
};

// GET /api/messages — return all stored messages
router.get("/", (req, res) => {
  res.json(store.getAllMessages());
});

// POST /api/messages/send — save a new message and deliver it to chat participants
router.post("/send", (req, res) => {
  try {
    const { loggedInAccountUserId, chatId, messageType, messageContent } =
      req.body;

    const newMessage = store.createMessage({
      senderId: loggedInAccountUserId,
      chatId,
      messageType,
      messageContent,
    });

    const io = req.app.get("io");
    emitToParticipants(io, chatId, "new_message", newMessage);

    res.status(201).json(newMessage);
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/messages/edit — update the text content of an existing message
router.patch("/edit", (req, res) => {
  try {
    const { chatId, messageId, newContent } = req.body;

    const updatedMessage = store.updateMessageContent({
      messageId,
      newContent,
    });

    const io = req.app.get("io");
    emitToParticipants(io, chatId, "message_edited", updatedMessage);

    res.status(200).json(updatedMessage);
  } catch (err) {
    console.error("Error editing message:", err);
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/messages/delete — hide or permanently remove a message
router.delete("/delete", (req, res) => {
  try {
    const { chatId, messageId, deleteMode, deleterId } = req.body;

    const result = store.removeMessage({ messageId, deleteMode, deleterId });

    const io = req.app.get("io");
    emitToParticipants(io, chatId, "message_deleted", result);

    res.status(200).json(result);
  } catch (err) {
    console.error("Error deleting message:", err);
    res.status(400).json({ error: err.message });
  }
});

export default router;
