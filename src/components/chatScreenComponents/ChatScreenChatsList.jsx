import { useChatDataContext } from "../../context/ChatContext";
export default function ChatScreenChatsList() {
  const { users, chats, loggedInAccount, setOpendChatID, openedChat } =
    useChatDataContext();
  if (openedChat) return;
  return (
    <div>
      {chats
        .filter((chat) => {
          return chat.participants.includes(loggedInAccount.userID);
        })
        .map((chat) => {
          const otherParticipantID = chat.participants.find((part) => {
            return part !== loggedInAccount.userID;
          });

          const otherParticipant = users.find(
            (usr) => usr.userID === otherParticipantID,
          );

          return (
            <div
              key={chat.chatID}
              style={{
                border: "1px solid silver",
                height: "50px",
                display: "flex",
              }}
              onClick={() => setOpendChatID(chat.chatID)}
            >
              <img
                src={otherParticipant.avatar}
                alt="none"
                style={{ width: "30px" }}
              />
              <h3 style={{ margin: "5px" }}>{otherParticipant.userName}</h3>
            </div>
          );
        })}
    </div>
  );
}
