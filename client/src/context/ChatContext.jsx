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
  const [openedChatId, setOpenedChatId] = useState("");

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

    socket.on("chat_created", (newChat) => {
      setChats((prevChats) => [...prevChats, newChat]);
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

    loginAccount(data);
    return true;
  };

  const loginAccount = async ({ userName, userPassword }) => {
    const res = await fetch(`${DOMAIN}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userName, userPassword }),
    });

    const data = await res.json();

    if (!res.ok) {
      Swal.fire({
        title: "Wrong Details",
        text: data.error || "One or more details is wrong",
        timer: 2000,
        icon: "error",
      });
      return false;
    }

    Swal.fire({
      title: "logged In Successfuly",
      timer: 1500,
      icon: "success",
      showConfirmButton: false,
    });

    setLoggedInUsername(data.userName);
    return true;
  };

  const openChat = async (userId) => {
    let selectedChat =
      chats &&
      chats.find((chat) => {
        return (
          chat.participants.includes(loggedInAccount.userId) &&
          chat.participants.includes(userId)
        );
      });

    if (!selectedChat) {
      selectedChat = await createChat(userId);
    }

    setOpenedChatId(selectedChat.chatId);
  };

  const createChat = async (userId) => {
    const res = await fetch(`${DOMAIN}/api/chats/create`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        loggedInAccountUserId: loggedInAccount.userId,
        userId,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      console.log(data.error);
      return false;
    }

    return data;
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
