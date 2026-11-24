import { useChatDataContext, useChatActionsContext } from "../../context/ChatContext";

export default function ChatScreenHeader() {
  const { loggedInAccount, openedChat, setOpenedChatId, users } = useChatDataContext();
  const { logoutAccount } = useChatActionsContext();

  // ── Active chat view — show back button and other participant's name ────────
  if (openedChat) {
    const otherParticipantId = openedChat.participants.find(
      (id) => id !== loggedInAccount.userId
    );
    const otherParticipant = users.find((u) => u.userId === otherParticipantId);

    return (
      <div style={{ padding: "8px 12px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <button
            style={buttonStyle}
            onClick={() => setOpenedChatId(null)}
            title="Back to chat list"
          >
            ← Back
          </button>
          <h4 style={{ margin: "0", flex: 1, textAlign: "center" }}>
            {otherParticipant?.userName ?? "Unknown"}
          </h4>
        </div>
        <hr />
      </div>
    );
  }

  // ── Default view — app title, logged-in username, and logout ────────────────
  return (
    <div style={{ padding: "8px 12px" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <h5 style={{ margin: "0" }}>{loggedInAccount.userName}</h5>
        <h4 style={{ margin: "0", flex: 1, textAlign: "center" }}>CheatyChat</h4>
        <button
          style={buttonStyle}
          onClick={logoutAccount}
          title="Log out"
        >
          Logout
        </button>
      </div>
      <hr />
    </div>
  );
}

// Shared button reset style — layout only, no visual design
const buttonStyle = {
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
};
