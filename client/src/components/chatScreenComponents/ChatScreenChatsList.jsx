import { useChatDataContext } from "../../context/ChatContext";

// Component to render the list of available conversations for the logged-in user
export default function ChatScreenChatsList() {
  const { users, chats, loggedInAccount, setOpenedChatId, openedChat } =
    useChatDataContext();

  // Hide the conversation list when a chat is open
  if (openedChat) return;

  // Filter and display chats in which the logged in user participates
  return (
    <div style={{ flex: 1, overflowY: "auto" }}>
      {chats
        .filter((chat) => chat.participants?.includes(loggedInAccount.userId))
        .map((chat) => {
          // Identify the other participant in this 1-on-1 chat
          const otherUserId = chat.participants.find(
            (participantId) => participantId !== loggedInAccount.userId,
          );
          const otherParticipant = users.find(
            (user) => user.userId === otherUserId,
          );
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
