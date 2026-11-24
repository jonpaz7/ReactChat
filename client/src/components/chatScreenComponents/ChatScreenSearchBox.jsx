import { useState } from "react";
import { useChatDataContext, useChatActionsContext } from "../../context/ChatContext";

export default function ChatScreenSearchBox() {
  const { users, loggedInAccount, openedChat } = useChatDataContext();
  const { openChat } = useChatActionsContext();
  const [searchTerm, setSearchTerm] = useState("");

  // Hide the search box while inside a conversation
  if (openedChat) return null;

  // Filter users: exclude current user and match the search input
  const matchedUsers = users.filter((user) => {
    if (user.userId === loggedInAccount.userId) return false;
    return user.userName.toLowerCase().includes(searchTerm.trim().toLowerCase());
  });

  const handleSelectUser = (userId) => {
    openChat(userId);
    setSearchTerm("");
  };

  return (
    <div style={{ position: "relative" }}>
      <input
        type="text"
        placeholder="Search users to start a chat..."
        value={searchTerm}
        style={{ width: "90%", margin: "2px auto", display: "block" }}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Dropdown results — only shown when there is an active search term */}
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
          {matchedUsers.length === 0 ? (
            <div style={{ padding: "4px 8px", color: "#aaa" }}>No users found</div>
          ) : (
            matchedUsers.map((user) => (
              <div
                key={user.userId}
                style={{ border: "1px solid silver", padding: "4px 8px", cursor: "pointer" }}
                onClick={() => handleSelectUser(user.userId)}
              >
                <h4 style={{ margin: "0" }}>{user.userName}</h4>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
