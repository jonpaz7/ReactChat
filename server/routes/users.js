import express from "express";
import * as store from "../data/store.js";
import { socket } from "../../client/src/services/socket.js";

const router = express.Router();

// GET /api/users - Fetch list of all registered users
router.get("/", (req, res) => {
  res.json(store.getUsersData());
});

// POST /api/users/register - Register a new user and broadcast event via socket
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

// POST /api/users/login - Authenticate existing user credentials
router.post("/login", (req, res) => {
  try {
    const logginAccount = store.loginAccount(req.body);

    res.status(200).json(logginAccount);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
