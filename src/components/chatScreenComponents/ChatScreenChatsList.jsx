import { useChatDataContext } from "../../context/ChatContext";
export default function ChatScreenChatsList() {
  const { chats, loggedInAccount } = useChatDataContext();
  return (
    <div>
      {chats
        .filter((chat) => {
          return chat.participants.includes(loggedInAccount.userName);
        })
        .map((chat) => {
          const otherParticipantUsername = chat.participants.find((part) => {
            return part !== loggedInAccount.userName;
          });
          return (
            <div
              key={chat.chatID}
              style={{ border: "1px solid silver", height: "40px" }}
            >
              <h3 style={{ margin: "5px" }}>{otherParticipantUsername}</h3>
            </div>
          );
        })}
    </div>
  );
}
