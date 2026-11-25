import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  participants: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export const Chat = mongoose.model("Chat", chatSchema);
