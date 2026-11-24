import { useEffect, useRef, useState } from "react";
import { useChatDataContext, useChatActionsContext } from "../../context/ChatContext";
import ChatContextMenu from "./ChatContextMenu";

export default function ChatScreenChat() {
  const { openedChat, messages, loggedInAccount, users } = useChatDataContext();
  const { sendMessage } = useChatActionsContext();

  const [draftMessage, setDraftMessage] = useState("");
  const [contextMenu, setContextMenu] = useState(null); // { msg, x, y } or null
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to the latest message whenever the message list or active chat changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, openedChat?.chatId]);

  // Auto-focus the input field when a chat is opened
  useEffect(() => {
    if (openedChat) inputRef.current?.focus();
  }, [openedChat?.chatId]);

  // Close context menu when pressing Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setContextMenu(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!openedChat) return null;

  // Filter messages: only show messages that belong to this chat and haven't been hidden by the current user
  const visibleMessages = messages.filter((msg) => {
    if (msg.chatId !== openedChat.chatId) return false;
    const isHiddenByMe = msg.deleterId?.includes(loggedInAccount.userId);
    return !isHiddenByMe;
  });

  const handleSend = () => {
    const trimmed = draftMessage.trim();
    if (!trimmed) return;
    sendMessage(openedChat.chatId, "text", trimmed);
    setDraftMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const openContextMenu = (e, msg) => {
    e.preventDefault();
    setContextMenu({ msg, x: e.clientX, y: e.clientY });
  };

  return (
    <>
      {contextMenu && (
        <ChatContextMenu
          data={{ ...contextMenu, close: () => setContextMenu(null) }}
        />
      )}

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
        {/* Scrollable message list */}
        <div
          style={{
            flex: 1,
            border: "1px solid #e0e0e0",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
          }}
        >
          {visibleMessages.length === 0 && (
            <p style={{ textAlign: "center", color: "#aaa", marginTop: "20px" }}>
              No messages yet. Say hello! 👋
            </p>
          )}

          {visibleMessages.map((msg) => {
            const isMine = msg.senderId === loggedInAccount.userId;
            const sender = users.find((u) => u.userId === msg.senderId);
            const senderName = sender?.userName ?? "Unknown";

            return (
              <p
                key={msg.messageId}
                onContextMenu={(e) => openContextMenu(e, msg)}
                title="Right-click for options"
                style={{
                  textAlign: "left",
                  backgroundColor: isMine ? "#DCF8C6" : "#E7F3FF",
                  width: "fit-content",
                  padding: "2px 6px",
                  margin: isMine ? "2px auto 2px 2px" : "2px 2px 2px auto",
                  borderRadius: "5px",
                  cursor: "default",
                }}
              >
                <strong>{senderName}: </strong>
                {msg.content}
              </p>
            );
          })}

          {/* Invisible anchor used for auto-scrolling to the bottom */}
          <div ref={messagesEndRef} />
        </div>

        {/* Message input bar */}
        <div style={{ display: "flex", padding: "8px", gap: "8px" }}>
          <input
            ref={inputRef}
            style={{ flex: 1 }}
            placeholder="Type a message... (Enter to send)"
            value={draftMessage}
            onChange={(e) => setDraftMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleSend} disabled={!draftMessage.trim()}>
            Send
          </button>
        </div>
      </div>
    </>
  );
}
