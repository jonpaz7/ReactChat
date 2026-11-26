// In-memory data store (temporary — will be replaced by MongoDB)
import { User } from "../models/user.js";
import { Chat } from "../models/chat.js";
import { Message } from "../models/message.js";

// ─── Users ───────────────────────────────────────────────────────────────────

export const getAllUsers = async () => await User.find();

export const createUser = async ({ userName, userPassword }) => {
  const isUsernameTaken = await User.exists({
    userName: userName.trim().toLowerCase(),
  });

  if (isUsernameTaken) throw new Error("Username is already taken");

  const newUser = {
    userName: userName.trim(),
    userPassword: userPassword.trim(),
    avatar: `https://api.dicebear.com/10.x/personas/svg?seed=${userName.trim()}`,
  };

  return User.create(newUser);
};

export const authenticateUser = async ({ userName, userPassword }) => {
  const matchedUser = await User.findOne({
    userName: userName.trim().toLowerCase(),
  });

  if (!matchedUser) throw new Error("User does not exist");
  if (matchedUser.userPassword !== userPassword)
    throw new Error("Wrong password");

  return matchedUser;
};

// ─── Chats ────────────────────────────────────────────────────────────────────

export const getAllChats = async () => await Chat.find();

export const getChatById = async (chatId) => await Chat.findById(chatId);

// Returns the existing chat or creates a new one between two participants.
// Always returns { chat, isNew } with a consistent key name.
export const getOrCreateChat = async ({ loggedInAccountUserId, userId }) => {
  const existingChat = await Chat.findOne({
    participants: { $all: [loggedInAccountUserId, userId] },
  });

  if (existingChat) return { chat: existingChat, isNew: false };

  const newChat = {
    participants: [loggedInAccountUserId, userId],
  };

  return { chat: await Chat.create(newChat), isNew: true };
};

// ─── Messages ─────────────────────────────────────────────────────────────────

export const getAllMessages = async () => await Message.find();

export const createMessage = async ({
  senderId,
  chatId,
  messageType,
  messageContent,
}) => {
  const newMessage = {
    senderId,
    chatId,
    type: messageType,
    content: messageContent,
    isHidden: false,
  };

  return await Message.create(newMessage);
};

export const updateMessageContent = async ({ messageId, newContent }) => {
  return await Message.findByIdAndUpdate(
    messageId,
    { content: newContent },
    { new: true },
  );
};

export const removeMessage = async ({ messageId, deleteMode, deleterId }) => {
  if (deleteMode === "hide") {
    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      { $set: { isHidden: true }, $addToSet: { deleterId: deleterId } },
      { new: true },
    );

    return { deletedMessage: updatedMessage, deleteMode };
  }

  if (deleteMode === "permanent") {
    // Permanently remove the message for all participants
    const removedMessage = await Message.findByIdAndDelete(messageId);
    return { deletedMessage: removedMessage, deleteMode };
  }

  throw new Error("Invalid deleteMode");
};
