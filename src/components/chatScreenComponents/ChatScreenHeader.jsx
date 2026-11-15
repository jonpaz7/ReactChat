import { useChatDataContext } from "../../context/ChatContext";

export default function ChatScreenHeader() {
  const {
    loggedInAccount,
    setLoggedInAccountUsrName,
    openedChat,
    setOpendChatID,
    users,
  } = useChatDataContext();

  if (openedChat) {
    const otherParticipant = users.find(
      (usr) =>
        usr.userID ===
        openedChat.participants.find((part) => part !== loggedInAccount.userID),
    );
    return (
      <div style={{ height: "10%", overflow: "hidden", position: "relative" }}>
        <div style={{ display: "flex" }}>
          <h4 style={{ margin: "5px auto" }}>{otherParticipant.userName}</h4>
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
            onClick={() => setOpendChatID(null)}
          >
            Back
          </button>
        </div>

        <hr />
      </div>
    );
  }

  return (
    <div style={{ height: "10%", overflow: "hidden", position: "relative" }}>
      <div style={{ display: "flex" }}>
        <h5 style={{ margin: "5px auto", position: "absolute", left: "10px" }}>
          {loggedInAccount.userName}
        </h5>
        <h4 style={{ margin: "5px auto" }}>CheatyChat</h4>
        <button
          style={{
            all: "unset", // מוחק לחלוטין את כל עיצוב ברירת המחדל של הדפדפן
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
            userSelect: "none", // מונע סימון כחול של הטקסט בלחיצות מהירות
          }}
          onClick={() => setLoggedInAccountUsrName(null)}
        >
          Logout
        </button>
      </div>

      <hr />
    </div>
  );
}
