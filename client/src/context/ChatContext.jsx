import { createContext, useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import { socket } from "../services/socket.js";
import { SERVER_URL } from "../config.js";

// ─── Context Definitions ──────────────────────────────────────────────────────

export const ChatDataContext = createContext(null);
export const ChatActionsContext = createContext(null);

// Custom hooks for consuming each context
export const useChatDataContext = () => useContext(ChatDataContext);
export const useChatActionsContext = () => useContext(ChatActionsContext);

// ─── Provider ─────────────────────────────────────────────────────────────────

export default function ChatContext({ children }) {
  // ── State ──────────────────────────────────────────────────────────────────

  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);

  // The logged-in user is tracked by username and derived from the users list
  const [loggedInUsername, setLoggedInUsername] = useState("");
  const [openedChatId, setOpenedChatId] = useState(null);

  // Derived values — computed from state, not stored separately
  const loggedInAccount = users.find((u) => u.userName === loggedInUsername) ?? null;
  const openedChat = chats.find((c) => c.chatId === openedChatId) ?? null;

  // ── Initial Data Fetch + Socket Listeners ──────────────────────────────────

  useEffect(() => {
    // Load all users, chats and messages from the server on first render
    const fetchAllData = async () => {
      try {
        const [usersRes, chatsRes, messagesRes] = await Promise.all([
          fetch(`${SERVER_URL}/api/users`),
          fetch(`${SERVER_URL}/api/chats`),
          fetch(`${SERVER_URL}/api/messages`),
        ]);

        const [usersData, chatsData, messagesData] = await Promise.all([
          usersRes.json(),
          chatsRes.json(),
          messagesRes.json(),
        ]);

        setUsers(usersData);
        setChats(chatsData);
        setMessages(messagesData);
      } catch (err) {
        console.error("Failed to load initial data:", err);
      }
    };

    fetchAllData();

    // ── Real-time event handlers ─────────────────────────────────────────────

    // A new user registered on another client — add them to the local list
    socket.on("user_registered", (newUser) => {
      setUsers((prev) => [...prev, newUser]);
    });

    // A new chat was created on another client
    socket.on("chat_created", (newChat) => {
      setChats((prev) => [...prev, newChat]);
    });

    // A new message was delivered to this user's room
    socket.on("new_message", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    // Another participant edited a message
    socket.on("message_edited", (updatedMessage) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.messageId === updatedMessage.messageId ? updatedMessage : msg
        )
      );
    });

    // A message was hidden or permanently deleted
    socket.on("message_deleted", ({ deletedMessage, deleteMode }) => {
      if (deleteMode === "hide") {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.messageId === deletedMessage.messageId ? deletedMessage : msg
          )
        );
      } else if (deleteMode === "permanent") {
        setMessages((prev) =>
          prev.filter((msg) => msg.messageId !== deletedMessage.messageId)
        );
      }
    });

    // Clean up all listeners when the context unmounts (prevents duplicate handlers)
    return () => {
      socket.off("user_registered");
      socket.off("chat_created");
      socket.off("new_message");
      socket.off("message_edited");
      socket.off("message_deleted");
    };
  }, []);

  // ── Actions ────────────────────────────────────────────────────────────────

  // Register a new account, then automatically log the user in
  const createAccount = async ({ userName, userPassword }) => {
    const res = await fetch(`${SERVER_URL}/api/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userName, userPassword }),
    });
    const data = await res.json();

    if (!res.ok) {
      Swal.fire({ title: data.error || "Registration failed", icon: "error" });
      return false;
    }

    // Auto-login with the original credentials (not the response object)
    await loginAccount({ userName, userPassword });
    return true;
  };

  // Verify credentials with the server and open the user's session
  const loginAccount = async ({ userName, userPassword }) => {
    const res = await fetch(`${SERVER_URL}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userName, userPassword }),
    });
    const data = await res.json();

    if (!res.ok) {
      Swal.fire({
        title: "Login failed",
        text: data.error || "Incorrect username or password",
        icon: "error",
        timer: 2000,
      });
      return false;
    }

    setLoggedInUsername(data.userName);

    // Connect the socket and join the user's personal room for targeted delivery
    socket.connect();
    socket.emit("user_connected", data.userId);

    return true;
  };

  // Log out the current user and tear down the socket connection
  const logoutAccount = () => {
    setLoggedInUsername(null);
    setOpenedChatId(null);
    socket.disconnect();
  };

  // Open an existing chat or create a new one, then navigate into it
  const openChat = async (targetUserId) => {
    // Check local state first to avoid an unnecessary round-trip
    const existingChat = chats.find(
      (chat) =>
        chat.participants.includes(loggedInAccount.userId) &&
        chat.participants.includes(targetUserId)
    );

    if (existingChat) {
      setOpenedChatId(existingChat.chatId);
      return;
    }

    // No local chat found — create one on the server
    const res = await fetch(`${SERVER_URL}/api/chats/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        loggedInAccountUserId: loggedInAccount.userId,
        userId: targetUserId,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      console.error("Failed to create chat:", data.error);
      return;
    }

    setOpenedChatId(data.chatId);
  };

  // Send a text (or typed) message to the currently open chat
  const sendMessage = async (chatId, messageType, messageContent) => {
    const res = await fetch(`${SERVER_URL}/api/messages/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        loggedInAccountUserId: loggedInAccount.userId,
        chatId,
        messageType,
        messageContent,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      console.error("Failed to send message:", data.error);
    }
  };

  // Edit the text content of an existing message
  const editMessage = async (messageId, newContent) => {
    const res = await fetch(`${SERVER_URL}/api/messages/edit`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatId: openedChat.chatId, messageId, newContent }),
    });

    if (!res.ok) {
      const data = await res.json();
      console.error("Failed to edit message:", data.error);
    }
  };

  // Hide a message for the current user, or delete it permanently for everyone
  const deleteMessage = async (messageId, deleteMode, deleterId) => {
    const res = await fetch(`${SERVER_URL}/api/messages/delete`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chatId: openedChat.chatId,
        messageId,
        deleteMode,
        deleterId,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      console.error("Failed to delete message:", data.error);
    }
  };

  // ── Context Value ──────────────────────────────────────────────────────────

  const dataValue = {
    loggedInAccount,
    users,
    chats,
    messages,
    openedChat,
    setOpenedChatId,
    setLoggedInUsername,
  };

  const actionsValue = {
    createAccount,
    loginAccount,
    logoutAccount,
    openChat,
    sendMessage,
    editMessage,
    deleteMessage,
  };

  return (
    <ChatDataContext.Provider value={dataValue}>
      <ChatActionsContext.Provider value={actionsValue}>
        {children}
      </ChatActionsContext.Provider>
    </ChatDataContext.Provider>
  );
}
