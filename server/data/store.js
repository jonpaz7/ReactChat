// In-memory data collections (state stores)
let users = [];
let chats = [];
let messages = ["msgssssssssssssssssssssss"];

// Retrieve all stored users
export const getUsersData = () => {
  return users;
};

// Retrieve all stored chats
export const getChatsData = () => {
  return chats;
};

// Retrieve all stored messages
export const getMessagesData = () => {
  return messages;
};

// Create a new user account with unique ID and avatar
export const createAccount = ({ userName, userPassword }) => {
  // Check if username is already in use (case-insensitive)
  const isTaken = users.some(
    (user) => user.userName?.toLowerCase() === userName.trim().toLowerCase(),
  );

  if (isTaken) throw new Error("User Name Already Taken");

  // Construct new user entity
  const newUser = {
    userId: `usr_${crypto.randomUUID()}`,
    userName: userName.trim(),
    userPassword: userPassword.trim(),
    avatar: `https://api.dicebear.com/10.x/personas/svg?seed=${userName.trim()}`,
  };

  // Persist user in the list
  users.push(newUser);
  return newUser;
};

// Validate user credentials and authenticate user login
export const loginAccount = ({ userName, userPassword }) => {
  const logginAccount = users.find((user) => user.userName === userName);

  const isExist = logginAccount;
  if (!isExist) throw new Error("User Dosent Exist");

  const isPasswordCorrect = logginAccount.userPassword === userPassword;
  if (!isPasswordCorrect) throw new Error("Wrong Password");

  return logginAccount;
};

// Create a new conversation/chat between two participants
export const getOrCreateChat = ({ loggedInAccountUserId, userId }) => {
  const existingChat = chats.find((c) => {
    return (
      c.participants.includes(loggedInAccountUserId) &&
      c.participants.includes(userId)
    );
  });

  if (existingChat) return { existingChat, isNew: false };

  const chat = {
    chatId: `chat_${crypto.randomUUID()}`,
    participants: [loggedInAccountUserId, userId],
  };

  chats.push(chat);
  return { chat, isNew: true };
};

export const sendMessage = ({
  loggedInAccountUserId,
  chatId,
  messageType,
  messageContent,
}) => {
  const newMessage = {
    messageId: `msg_${crypto.randomUUID()}`,
    senderId: loggedInAccountUserId,
    type: messageType,
    content: messageContent,
    chatId: chatId,
    isHidden: false,
  };

  messages.push(newMessage);

  const chat = chats.find((c) => c.chatId === chatId);
  return { newMessage, chat };
};
