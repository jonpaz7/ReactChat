// In-memory data store (temporary — will be replaced by MongoDB)
let users = [
  {
    userId: `usr_${crypto.randomUUID()}`,
    userName: "1",
    userPassword: "1",
    avatar: `https://api.dicebear.com/10.x/personas/svg?seed=1`,
  },
  {
    userId: `usr_${crypto.randomUUID()}`,
    userName: "2",
    userPassword: "2",
    avatar: `https://api.dicebear.com/10.x/personas/svg?seed=2`,
  },
];
let chats = [];
let messages = [];

// ─── Users ───────────────────────────────────────────────────────────────────

export const getAllUsers = () => users;

export const createUser = ({ userName, userPassword }) => {
  const isUsernameTaken = users.some(
    (user) => user.userName?.toLowerCase() === userName.trim().toLowerCase(),
  );

  if (isUsernameTaken) throw new Error("Username is already taken");

  const newUser = {
    userId: `usr_${crypto.randomUUID()}`,
    userName: userName.trim(),
    userPassword: userPassword.trim(),
    avatar: `https://api.dicebear.com/10.x/personas/svg?seed=${userName.trim()}`,
  };

  users.push(newUser);
  return newUser;
};

export const authenticateUser = ({ userName, userPassword }) => {
  const matchedUser = users.find((user) => user.userName === userName);

  if (!matchedUser) throw new Error("User does not exist");
  if (matchedUser.userPassword !== userPassword)
    throw new Error("Wrong password");

  return matchedUser;
};

// ─── Chats ────────────────────────────────────────────────────────────────────

export const getAllChats = () => chats;

export const getChatById = (chatId) => chats.find((c) => c.chatId === chatId);

// Returns the existing chat or creates a new one between two participants.
// Always returns { chat, isNew } with a consistent key name.
export const getOrCreateChat = ({ loggedInAccountUserId, userId }) => {
  const existingChat = chats.find(
    (c) =>
      c.participants.includes(loggedInAccountUserId) &&
      c.participants.includes(userId),
  );

  if (existingChat) return { chat: existingChat, isNew: false };

  const newChat = {
    chatId: `chat_${crypto.randomUUID()}`,
    participants: [loggedInAccountUserId, userId],
  };

  chats.push(newChat);
  return { chat: newChat, isNew: true };
};

// ─── Messages ─────────────────────────────────────────────────────────────────

export const getAllMessages = () => messages;

export const createMessage = ({
  senderId,
  chatId,
  messageType,
  messageContent,
}) => {
  const newMessage = {
    messageId: `msg_${crypto.randomUUID()}`,
    senderId,
    chatId,
    type: messageType,
    content: messageContent,
    isHidden: false,
    createdAt: new Date().toISOString(),
  };

  messages.push(newMessage);
  return newMessage;
};

export const updateMessageContent = ({ messageId, newContent }) => {
  const index = messages.findIndex((m) => m.messageId === messageId);
  if (index === -1) throw new Error("Message not found");

  messages[index] = { ...messages[index], content: newContent };
  return messages[index];
};

export const removeMessage = ({ messageId, deleteMode, deleterId }) => {
  const index = messages.findIndex((m) => m.messageId === messageId);
  if (index === -1) throw new Error("Message not found");

  if (deleteMode === "hide") {
    // Mark message as hidden for this specific user only
    const updatedMessage = {
      ...messages[index],
      isHidden: true,
      deleterId: [
        ...new Set([...(messages[index].deleterId ?? []), deleterId]),
      ],
    };
    messages[index] = updatedMessage;
    return { deletedMessage: updatedMessage, deleteMode };
  }

  if (deleteMode === "permanent") {
    // Permanently remove the message for all participants
    const [removedMessage] = messages.splice(index, 1);
    return { deletedMessage: removedMessage, deleteMode };
  }

  throw new Error("Invalid deleteMode");
};
