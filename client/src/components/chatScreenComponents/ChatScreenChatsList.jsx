import { useChatDataContext } from "../../context/ChatContext";

export default function ChatScreenChatsList() {
  const { users, chats, loggedInAccount, setOpenedChatId, openedChat } =
    useChatDataContext();

  if (openedChat) return;

  return (
    <div style={{ flex: 1, overflowY: "auto" }}>
      {chats
        .filter((chat) => chat.participants?.includes(loggedInAccount.userId))
        .map((chat) => {
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
