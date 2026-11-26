import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    userPassword: { type: String, required: true },
    avatar: {
      type: String,
      default: function () {
        return `https://api.dicebear.com/10.x/personas/svg?seed=${this.userName.trim()}`;
      },
    },
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        ret.userId = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform: (doc, ret) => {
        ret.userId = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

export const User = mongoose.model("User", userSchema);
