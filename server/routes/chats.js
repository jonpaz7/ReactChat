import express from "express";
import * as store from "../data/store.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json(store.getChatsData());
});

export default router;
