import express from "express";

const router = express.Router();

let messages = [{ msgid: 1, content: "hello world" }];

router.get("/", (req, res) => {
  res.json(messages);
});

export const addMessage = (data) => {
  return "added successfuly";
};

export default router;
