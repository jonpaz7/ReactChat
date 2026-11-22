let users = [];
let chats = ["chatssssssssssssssss"];
let messages = ["msgssssssssssssssssssssss"];

export const getUsersData = () => {
  return users;
};
export const getChatsData = () => {
  return chats;
};
export const getMessagesData = () => {
  return messages;
};

export const createAccount = ({ userName, userPassword }) => {
  const isTaken = users.some(
    (user) => user.userName?.toLowerCase() === userName.trim().toLowerCase(),
  );

  if (isTaken) throw new Error("User Name Already Taken");

  const newUser = {
    userId: `usr_${crypto.randomUUID()}`,
    userName: userName.trim(),
    userPassword: userPassword.trim(),
    avatar: `https://api.dicebear.com/10.x/personas/svg?seed=${userName.trim()}`,
  };

  users.push(newUser);
  return newUser;
};
