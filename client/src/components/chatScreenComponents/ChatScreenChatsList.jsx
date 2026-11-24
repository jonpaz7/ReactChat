import { useChatDataContext } from "../../context/ChatContext";

export default function ChatScreenChatsList() {
  const { users, chats, loggedInAccount, setOpenedChatId, openedChat } =
    useChatDataContext();

  // Hide the list while a conversation is open
  if (openedChat) return null;

  const myChats = chats.filter((chat) =>
    chat.participants?.includes(loggedInAccount.userId)
  );

  if (myChats.length === 0) {
    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#aaa" }}>No conversations yet. Search for a user above to start one.</p>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflowY: "auto" }}>
      {myChats.map((chat) => {
        const otherUserId = chat.participants.find(
          (id) => id !== loggedInAccount.userId
        );
        const otherParticipant = users.find((u) => u.userId === otherUserId);

        // Guard against a participant whose data isn't loaded yet
        if (!otherParticipant) return null;

        return (
          <div
            key={chat.chatId}
            style={{
              border: "1px solid silver",
              height: "50px",
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={() => setOpenedChatId(chat.chatId)}
            title={`Open chat with ${otherParticipant.userName}`}
          >
            <img
              src={otherParticipant.avatar}
              alt={otherParticipant.userName}
              style={{ width: "30px" }}
            />
            <h3 style={{ margin: "5px" }}>{otherParticipant.userName}</h3>
          </div>
        );
      })}
    </div>
  );
}
