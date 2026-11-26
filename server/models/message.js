import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    type: { type: String, required: true },
    content: { type: String },
    isHidden: { type: Boolean, default: false },
    deleterId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        ret.messageId = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform: (doc, ret) => {
        ret.messageId = ret._id.toString();
        delete ret._id;
        delete ret._v;
        return ret;
      },
    },
  },
);

export const Message = mongoose.model("Message", messageSchema);
