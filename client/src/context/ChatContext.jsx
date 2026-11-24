import { createContext, useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import { io } from "socket.io-client";
import { socket } from "../services/socket.js";

const DOMAIN = "http://localhost:5000";

// Provider component managing chat state and server communication
export default function ChatContext({ children }) {
  //=========================================== Data States ==========================

  // Users, active chats, and message history
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);

  // Session state: current user and active conversation ID
  const [loggedInUsername, setLoggedInUsername] = useState("");
  const [openedChatId, setOpenedChatId] = useState("");

  // Derived state: active account object and active chat object
  const loggedInAccount = users
    ? users.find((user) => user.userName === loggedInUsername)
    : null;
  const openedChat = chats.find((chat) => chat.chatId === openedChatId) || null;

  //=========================================== Server Communication ==========================

  // Fetch initial data on mount and subscribe to real-time socket events
  useEffect(() => {
    // Fetch initial list of users from server
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

    // Fetch initial list of chats from server
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

    // Fetch initial messages list from server
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

    // Listen for new user registration events from socket
    socket.on("account_created", (newAccount) => {
      setUsers((prevUsers) => {
        return [...prevUsers, newAccount];
      });
    });

    // Listen for new chat creation events from socket
    socket.on("chat_created", (newChat) => {
      setChats((prevChats) => [...prevChats, newChat]);
    });

    socket.on("new_message", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    socket.on("message_edited", (editedMessage) => {
      setMessages((prevMessages) => {
        return prevMessages.map((msg) => {
          if (msg.messageId === editedMessage.messageId) {
            return editedMessage;
          }
          return msg;
        });
      });
    });

    socket.on("message_deleted", ({ deletedMessage, deleteMode }) => {
      if (deleteMode === "hide") {
        setMessages((prevMessages) => {
          return prevMessages.map((msg) => {
            if (msg.messageId === deletedMessage.messageId) {
              return deletedMessage;
            }
            return msg;
          });
        });
      }

      // Permanent mode: completely remove message from array
      if (deleteMode === "permanent") {
        setMessages((prevMessages) => {
          return prevMessages.filter((msg) => {
            if (msg.messageId === deletedMessage.messageId) return false;
            return true;
          });
        });
      }
    });
    return () => {
      socket.off("account_created");
      socket.off("chat_created");
      socket.off("new_message");
      socket.off("message_edited");
    };
  }, []);

  //=========================================== Action Functions ==========================

  // Register a new user account via API and auto-login on success
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

  // Authenticate user credentials and set session state
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
    socket.emit("account_logged_in", data.userId);
    return true;
  };

  // Find or create a chat with the selected user, then mark it as opened
  const openChat = async (userId) => {
    let selectedChat = chats.find((chat) => {
      return (
        chat.participants.includes(loggedInAccount.userId) &&
        chat.participants.includes(userId)
      );
    });

    if (!selectedChat) {
      selectedChat = await getOrCreateChat(userId);
    }

    setOpenedChatId(selectedChat.chatId);
  };

  // Post request to create a new chat between current user and target user
  const getOrCreateChat = async (userId) => {
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

  // Send a message
  const sendMessage = async (chatId, messageType, messageContent) => {
    await fetch(`${DOMAIN}/api/messages/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        loggedInAccountUserId: loggedInAccount.userId,
        chatId,
        messageType,
        messageContent,
      }),
    });
  };

  // Update content of an existing message in local state
  const editMessage = async (msgId, newContent) => {
    await fetch(`${DOMAIN}/api/messages/edit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatId: openedChat.chatId, msgId, newContent }),
    });
  };

  // Delete message: either hide it for current user or remove permanently for all
  const deleteMessage = async (msgId, deleteMode, deleterId) => {
    await fetch(`${DOMAIN}/api/messages/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chatId: openedChat.chatId,
        msgId,
        deleteMode,
        deleterId,
      }),
    });
  };

  //=========================================== Context Value Bundling ==========================

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

  // Render context providers wrapping child components
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

// Custom hook to consume chat data state
export const useChatDataContext = () => {
  return useContext(ChatDataContext);
};

// Custom hook to consume chat actions and handlers
export const useChatActionsContext = () => {
  return useContext(ChatActionsContext);
};
