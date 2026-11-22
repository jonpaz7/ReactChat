import { createContext, useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import { io } from "socket.io-client";
import { socket } from "../services/socket.js";

const DOMAIN = "http://localhost:5000";
export default function ChatContext({ children }) {
  //=========================================== Data ==========================

  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);

  const [loggedInUsername, setLoggedInUsername] = useState("");
  const [openedChatId, setOpenedChatId] = useState(null);

  const loggedInAccount = users
    ? users.find((user) => user.userName === loggedInUsername)
    : null;
  const openedChat = chats.find((chat) => chat.chatId === openedChatId) || null;

  //=========================================== Server Cumunication ==========================

  //=================== Loads the data from the server
  useEffect(() => {
    // Loads users
    const fetchInitUsersData = async () => {
      try {
        const res = await fetch(`${DOMAIN}/api/users`);
        const data = await res.json();

        setUsers(data);
        console.log(data);
      } catch {
        (err) => console.log("Couldnt load users", err);
      }
    };
    fetchInitUsersData();
    // Loads chats
    const fetchInitChatsData = async () => {
      try {
        const res = await fetch(`${DOMAIN}/api/chats`);
        const data = await res.json();

        setChats(data);
        console.log(data);
      } catch {
        (err) => console.log("Couldnt load chats", err);
      }
    };
    fetchInitChatsData();
    // Loads messages
    const fetchInitMessagesData = async () => {
      try {
        const res = await fetch(`${DOMAIN}/api/messages`);
        const data = await res.json();

        setMessages(data);
        console.log(data);
      } catch {
        (err) => console.log("Couldnt load messages", err);
      }
    };
    fetchInitMessagesData();

    socket.on("account_created", (newAccount) => {
      setUsers((prevUsers) => {
        return [...prevUsers, newAccount];
      });
    });
  }, []);

  //=========================================== Functions ==========================

  const createAccount = async ({ userName, userPassword }) => {
    const res = await fetch(`${DOMAIN}/api/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userName, userPassword }),
    });
    const data = await res.json();

    if (!res.ok) {
      Swal.fire({
        title: data.error || "Registration Failed",

        icon: "error",
      });
      return false;
    }

    //setLoggedInUsername(data.userName);
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
