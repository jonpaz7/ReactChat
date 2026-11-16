import {
  createContext,
  useState,
  useEffect,
  useContext,
} from "react";
import Swal from "sweetalert2";

export default function ChatContext({ children }) {
  const [users, setUsers] = useState(() => loadData("users"));
  const [chats, setChats] = useState(() => loadData("chats"));
  const [messages, setMessages] = useState(() => loadData("messages"));
  const [loggedInUsername, setLoggedInUsername] = useState(null);
  const [openedChatId, setOpenedChatId] = useState(null);

  const loggedInAccount = users.find(
    (user) => user.userName === loggedInUsername,
  );
  const openedChat = chats.find((chat) => chat.chatId === openedChatId);

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("chats", JSON.stringify(chats));
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [users, chats, messages]);

  function loadData(storageKey) {
    const savedData = localStorage.getItem(storageKey);
    return savedData && savedData !== "undefined" ? JSON.parse(savedData) : [];
  }

  const createAccount = ({ userName, userPassword }) => {
    if (
      users.some(
        (user) => user.userName.toLowerCase() === userName.trim().toLowerCase(),
      )
    ) {
      Swal.fire({
        title: "User Name already taken",
        timer: 2000,
      });
      return false;
    }

    const newUser = {
      userId: `usr_${crypto.randomUUID()}`,
      userName: userName.trim(),
      userPassword: userPassword.trim(),
      avatar: `https://api.dicebear.com/10.x/personas/svg?seed=${userName.trim()}`,
    };

    setUsers((prevUsers) => [...prevUsers, newUser]);
    setLoggedInUsername(newUser.userName);
    return true;
  };

  const loginAccount = ({ userName, userPassword }) => {
    const matchedUser = users.find((user) => user.userName === userName);

    if (!matchedUser || matchedUser.userPassword !== userPassword) {
      Swal.fire({
        title: "Wrong Details",
        text: "One or more details is wrong",
        timer: 2000,
        showConfirmButton: false,
      });
      return false;
    }

    setLoggedInUsername(matchedUser.userName);
    return true;
  };

  const openChat = (userId) => {
    let selectedChat = chats.find((chat) => {
      return (
        chat.participants.includes(loggedInAccount.userId) &&
        chat.participants.includes(userId)
      );
    });

    if (!selectedChat) {
      selectedChat = createChat(userId);
    }

    setOpenedChatId(selectedChat.chatId);
  };

  const createChat = (userId) => {
    const newChat = {
      chatId: `chat_${crypto.randomUUID()}`,
      participants: [loggedInAccount.userId, userId],
    };

    setChats((prevChats) => [...prevChats, newChat]);
    return newChat;
  };

  const sendMessage = (chatId, messageType, messageContent) => {
    const newMessage = {
      messageId: `msg_${crypto.randomUUID()}`,
      senderId: loggedInAccount.userId,
      type: messageType,
      content: messageContent,
      chatId: chatId,
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const dataContextValue = {
    loggedInAccount,
    setLoggedInUsername,
    users,
    openedChat,
    chats,
    setOpenedChatId,
    messages,
  };
  const actionsContextValue = { createAccount, loginAccount, openChat, sendMessage };

  return (
    <ChatDataContext.Provider value={dataContextValue}>
      <ChatActionsContext.Provider value={actionsContextValue}>
        {children}
      </ChatActionsContext.Provider>
    </ChatDataContext.Provider>
  );
}

export const ChatDataContext = createContext(null);
export const ChatActionsContext = createContext(null);

export const useChatDataContext = () => {
  return useContext(ChatDataContext);
};
export const useChatActionsContext = () => {
  return useContext(ChatActionsContext);
};
