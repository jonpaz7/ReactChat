import { createContext, useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import { io } from "socket.io-client";
import { socket } from "../services/socket.js";

export default function ChatContext({ children }) {
  //=========================================== Data ==========================

  const [users, setUsers] = useState(() => loadData("users"));
  const [chats, setChats] = useState(() => loadData("chats"));
  const [messages, setMessages] = useState(/*() => loadData("messages")*/);

  const [loggedInUsername, setLoggedInUsername] = useState("1");
  const [openedChatId, setOpenedChatId] = useState(null);

  const loggedInAccount =
    users.find((user) => user.userName === loggedInUsername) || null;
  const openedChat = chats.find((chat) => chat.chatId === openedChatId) || null;

  //=========================================== Server Cumunication ==========================

  useEffect(() => {
    //=================== Loads the data from the server
    // Loads users
    const fetchInitUsersData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/messages");
        const data = await res.json();

        setMessages(data);
        console.log(data);
      } catch {
        (err) => console.log("Couldnt load messages", err);
      }
    };
    fetchInitUsersData();
    // Loads chats
    const fetchInitChatsData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/messages");
        const data = await res.json();

        setMessages(data);
        console.log(data);
      } catch {
        (err) => console.log("Couldnt load messages", err);
      }
    };
    fetchInitChatsData();
    // Loads messages
    const fetchInitMessagesData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/messages");
        const data = await res.json();

        setMessages(data);
        console.log(data);
      } catch {
        (err) => console.log("Couldnt load messages", err);
      }
    };
    fetchInitMessagesData();
  }, []);

  //=========================================== Functions ==========================

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
      isHidden: false,
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const editMessage = (msgId, newContent) => {
    setMessages((prevMessages) => {
      return messages.map((msg) => {
        if (msg.messageId === msgId) {
          return {
            ...msg,
            content: newContent,
          };
        }
        return msg;
      });
    });
  };

  const deleteMessage = (msgId, deleteMode, deleterId) => {
    if (deleteMode === "hide") {
      setMessages((prevMessages) => {
        return prevMessages.map((msg) => {
          if (msg.messageId === msgId) {
            return {
              ...msg,
              isHidden: true,
              deleterId: new Set([...(msg.deleterId ?? []), deleterId]),
            };
          }
          return msg;
        });
      });
    }

    if (deleteMode === "permanent") {
      setMessages((prevMessages) => {
        return prevMessages.filter((msg) => {
          if (msg.messageId === msgId) return false;
          return true;
        });
      });
    }
  };

  //=========================================== Return Section ==========================

  const dataContextValue = {
    loggedInAccount,
    setLoggedInUsername,
    users,
    openedChat,
    chats,
    setOpenedChatId,
    messages,
  };
  const actionsContextValue = {
    createAccount,
    loginAccount,
    openChat,
    sendMessage,
    deleteMessage,
    editMessage,
  };

  return (
    <ChatDataContext.Provider value={dataContextValue}>
      <ChatActionsContext.Provider value={actionsContextValue}>
        {children}
      </ChatActionsContext.Provider>
    </ChatDataContext.Provider>
  );
}

//=========================================== Exports & Custom Hooks ==========================

export const ChatDataContext = createContext(null);
export const ChatActionsContext = createContext(null);

export const useChatDataContext = () => {
  return useContext(ChatDataContext);
};
export const useChatActionsContext = () => {
  return useContext(ChatActionsContext);
};
