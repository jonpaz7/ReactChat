import express from "express";
import * as store from "../data/store.js";

const router = express.Router();

// GET /api/messages - Fetch all stored messages
router.get("/", (req, res) => {
  res.json(store.getMessagesData());
});

export default router;
