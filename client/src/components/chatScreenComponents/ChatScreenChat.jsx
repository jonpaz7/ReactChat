import { useEffect, useRef, useState } from "react";
import {
  useChatDataContext,
  useChatActionsContext,
} from "../../context/ChatContext";
import ChatContextMenu from "./ChatContextMenu";

// Active conversation view: displays message thread, handles sending, and context menus
export default function ChatScreenChat() {
  const { openedChat, messages, loggedInAccount, users } = useChatDataContext();
  const { sendMessage } = useChatActionsContext();

  // Local state for input draft, message type, and context menu coordinates
  const [draftMessage, setDraftMessage] = useState("");
  const [messageType, setMessageType] = useState("text");
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuData, setContextMenuData] = useState({});
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message on update or chat switch
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, openedChat?.chatId]);

  // Don't render chat view if no conversation is currently active
  if (!openedChat) return;

  // Handle draft text change
  const handleInputChange = (e) => {
    setDraftMessage(e.target.value);
  };

  // Dispatch new message and reset text box
  const handleSend = () => {
    if (draftMessage.trim()) {
      sendMessage(openedChat.chatId, messageType, draftMessage);
      setDraftMessage("");
    }
  };

  // Open custom context menu on right click at mouse coordinates
  const handleContextMenu = (e, msg) => {
    setContextMenuData({
      msg: msg,
      x: e.clientX,
      y: e.clientY,
      close: () => setShowContextMenu(false),
    });
    setShowContextMenu(true);
  };

  // Render message history container and bottom input bar
  return (
    <>
      {/* Context menu modal portal */}
      {showContextMenu && <ChatContextMenu data={contextMenuData} />}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
        }}
      >
        {/* Scrollable messages container */}
        <div
          style={{
            flex: 1,
            border: "1px solid #e0e0e0",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
          }}
        >
          {messages
            .filter((msg) => {
              const isDeletedByMe = msg.deleterId?.includes(
                loggedInAccount.userId,
              );

              // Keep messages that belong to this chat and haven't been hidden by current user
              if (msg.chatId === openedChat.chatId) {
                if (isDeletedByMe) return false;
                else return true;
              }
              return false;
            })
            .map((msg) => {
              const isSentByMe = msg.senderId === loggedInAccount.userId;
              const sender = users.find((user) => user.userId === msg.senderId);
              return (
                <p
                  onContextMenu={(e) => {
                    e.preventDefault();
                    handleContextMenu(e, msg);
                  }}
                  key={msg.messageId}
                  style={{
                    textAlign: "left",
                    backgroundColor: isSentByMe ? "#DCF8C6" : "#E7F3FF",
                    width: "fit-content",
                    padding: "2px 6px",
                    margin: isSentByMe
                      ? "2px auto 2px 2px"
                      : "2px 2px 2px auto",

                    borderRadius: "5px",
                  }}
                >
                  <strong>{sender.userName}: </strong>
                  {msg.content}
                </p>
              );
            })}
          {/* Scroll anchor target */}
          <div ref={messagesEndRef}></div>
        </div>

        {/* Message composer input bar */}
        <div style={{ display: "flex", padding: "8px", gap: "8px" }}>
          <input
            style={{ flex: 1 }}
            placeholder="Message"
            value={draftMessage}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </>
  );
}
