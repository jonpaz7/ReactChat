import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  userPassword: { type: String, required: true },
  avatar: {
    type: String,
    default: function () {
      return `https://api.dicebear.com/10.x/personas/svg?seed=${this.userName.trim()}`;
    },
  },
});

export const User = mongoose.model("User", userSchema);
