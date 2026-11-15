import { useState } from "react";
import {
  useChatDataContext,
  useChatActionsContext,
} from "../../context/ChatContext";

export default function ChatScreenChat() {
  const { openedChat, messages, loggedInAccount, users } = useChatDataContext();

  const { sendMessage } = useChatActionsContext();

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("text");

  if (!openedChat) return;

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSend = () => {
    if (message.trim()) {
      sendMessage(openedChat.chatID, messageType, message);
      setMessage("");
    }
  };

  return (
    <div>
      <div
        style={{
          width: "100%",
          height: "350px",
          zIndex: 1000,
          border: "1px solid #e0e0e0",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          overflowY: "auto",
        }}
      >
        {messages
          .filter((msg) => {
            return msg.chatID === openedChat.chatID;
          })
          .map((msg) => {
            const isLoggedInAccMsg =
              msg.messageSenderID === loggedInAccount.userID;
            const messageSender = users.find(
              (usr) => usr.userID === msg.messageSenderID,
            );
            return (
              <p
                key={msg.messageID}
                style={{
                  textAlign: isLoggedInAccMsg ? "left" : "right",
                  backgroundColor: isLoggedInAccMsg ? "#DCF8C6" : "#E7F3FF",
                  width: "fit-content",
                  padding: "2px 6px",
                  margin: isLoggedInAccMsg ? "2px 2px 2px auto" : "2px",
                  borderRadius: "5px",
                }}
              >
                <strong>{messageSender.userName}: </strong>
                {msg.messageContent}
              </p>
            );
          })}
      </div>
      <div style={{ position: "fixed", bottom: "60px", left: "35%" }}>
        <input
          placeholder="Message"
          value={message}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
