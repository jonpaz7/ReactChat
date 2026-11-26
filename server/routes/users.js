import express from "express";
import * as store from "../data/store.js";

const router = express.Router();

// GET /api/users — return all registered users
router.get("/", async (req, res) => {
  res.json(await store.getAllUsers());
});

// POST /api/users/register — create a new account and broadcast to all clients
router.post("/register", async (req, res) => {
  try {
    const newUser = await store.createUser(req.body);
    console.log("here");
    console.log(newUser);

    // Notify all connected clients that a new user registered
    const io = req.app.get("io");
    console.log(io);

    io.emit("user_registered", newUser);

    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/users/login — verify credentials and return user data
router.post("/login", async (req, res) => {
  try {
    const authenticatedUser = await store.authenticateUser(req.body);
    res.status(200).json(authenticatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
