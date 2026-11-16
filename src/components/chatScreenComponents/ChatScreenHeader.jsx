import { useChatDataContext } from "../../context/ChatContext";

export default function ChatScreenHeader() {
  const {
    loggedInAccount,
    setLoggedInUsername,
    openedChat,
    setOpenedChatId,
    users,
  } = useChatDataContext();

  if (openedChat) {
    const otherParticipant = users.find(
      (user) =>
        user.userId ===
        openedChat.participants.find(
          (participantId) => participantId !== loggedInAccount.userId,
        ),
    );
    return (
      <div style={{ padding: "8px 12px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <button
            style={{
              all: "unset",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "4px 10px",
              fontSize: "12px",
              fontWeight: "500",
              lineHeight: 1,
              borderRadius: "6px",
              cursor: "pointer",
              userSelect: "none",
            }}
            onClick={() => setOpenedChatId(null)}
          >
            Back
          </button>
          <h4 style={{ margin: "0", flex: 1, textAlign: "center" }}>
            {otherParticipant.userName}
          </h4>
        </div>
        <hr />
      </div>
    );
  }

  return (
    <div style={{ padding: "8px 12px" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <h5 style={{ margin: "0" }}>{loggedInAccount.userName}</h5>
        <h4 style={{ margin: "0", flex: 1, textAlign: "center" }}>
          CheatyChat
        </h4>
        <button
          style={{
            all: "unset",
            boxSizing: "border-box",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "4px 10px",
            fontSize: "12px",
            fontWeight: "500",
            lineHeight: 1,
            borderRadius: "6px",
            cursor: "pointer",
            userSelect: "none",
          }}
          onClick={() => setLoggedInUsername(null)}
        >
          Logout
        </button>
      </div>
      <hr />
    </div>
  );
}
