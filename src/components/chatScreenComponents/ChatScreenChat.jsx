import { useEffect, useRef, useState } from "react";
import {
  useChatDataContext,
  useChatActionsContext,
} from "../../context/ChatContext";

export default function ChatScreenChat() {
  const { openedChat, messages, loggedInAccount, users } = useChatDataContext();
  const { sendMessage } = useChatActionsContext();

  const [draftMessage, setDraftMessage] = useState("");
  const [messageType, setMessageType] = useState("text");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, openedChat?.chatId]);

  if (!openedChat) return;

  const handleInputChange = (e) => {
    setDraftMessage(e.target.value);
  };

  const handleSend = () => {
    if (draftMessage.trim()) {
      sendMessage(openedChat.chatId, messageType, draftMessage);
      setDraftMessage("");
    }
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
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
          .filter((msg) => msg.chatId === openedChat.chatId)
          .map((msg) => {
            const isSentByMe = msg.senderId === loggedInAccount.userId;
            const sender = users.find(
              (user) => user.userId === msg.senderId,
            );
            return (
              <p
                key={msg.messageId}
                style={{
                  textAlign: "left",
                  backgroundColor: isSentByMe ? "#DCF8C6" : "#E7F3FF",
                  width: "fit-content",
                  padding: "2px 6px",
                  margin: isSentByMe
                    ? "2px 2px 2px auto"
                    : "2px auto 2px 2px",
                  borderRadius: "5px",
                }}
              >
                <strong>{sender.userName}: </strong>
                {msg.content}
              </p>
            );
          })}
        <div ref={messagesEndRef}></div>
      </div>
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
  );
}
