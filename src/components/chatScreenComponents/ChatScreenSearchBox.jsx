import { useState } from "react";
import {
  useChatDataContext,
  useChatActionsContext,
} from "../../context/ChatContext";

export default function ChatScreenSearchBox() {
  const { users, loggedInAccount, openedChat } = useChatDataContext();
  const { openChat } = useChatActionsContext();
  const [searchTerm, setSearchTerm] = useState("");

  if (openedChat) return;

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div style={{ position: "relative" }}>
      <input
        type="text"
        placeholder="Search for chats"
        value={searchTerm}
        style={{ width: "90%", margin: "2px auto", display: "block" }}
        onChange={handleInputChange}
      />
      {searchTerm && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            zIndex: 10,
            backgroundColor: "white",
          }}
        >
          {users
            .filter((user) => {
              if (user.userId === loggedInAccount.userId) return false;
              return user.userName
                .toLowerCase()
                .includes(searchTerm.trim().toLowerCase());
            })
            .map((user) => (
              <div
                key={user.userId}
                style={{
                  border: "1px solid silver",
                  padding: "4px 8px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  openChat(user.userId);
                  setSearchTerm("");
                }}
              >
                <h4 style={{ margin: "0" }}>{user.userName}</h4>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
