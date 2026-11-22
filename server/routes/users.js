import express from "express";
import * as store from "../data/store.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json(store.getUsersData());
});

router.post("/register", (req, res) => {
  try {
    const newUser = store.createAccount(req.body);
    const io = req.app.get("io");
    io.emit("account_created", newUser);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
