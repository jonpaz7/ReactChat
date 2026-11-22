import { useState } from "react";
import {
  useChatDataContext,
  useChatActionsContext,
} from "../../context/ChatContext";

// Search bar to find registered users and initiate new conversations
export default function ChatScreenSearchBox() {
  const { users, loggedInAccount, openedChat } = useChatDataContext();
  const { openChat } = useChatActionsContext();
  const [searchTerm, setSearchTerm] = useState("");

  // Hide search box when viewing an open conversation
  if (openedChat) return;

  // Handle typing inside the search input
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Render input field and matching users dropdown
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
          {/* Filter users excluding current user and matching search query */}
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
