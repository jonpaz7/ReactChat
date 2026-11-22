import ChatScreenHeader from "./chatScreenComponents/ChatScreenHeader";
import ChatScreenChatsList from "./chatScreenComponents/ChatScreenChatsList";
import ChatScreenSearchBox from "./chatScreenComponents/ChatScreenSearchBox";
import ChatScreenChat from "./chatScreenComponents/ChatScreenChat";

// Container component for the main chat interface
export default function ChatScreen() {
  return (
    <div
      style={{
        border: "2px solid silver",
        height: "80vh",
        width: "50vw",
        margin: "auto",
        borderRadius: "25px",
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Top bar displaying user info or active chat title */}
      <ChatScreenHeader />

      {/* User search bar for starting conversations */}
      <ChatScreenSearchBox />

      {/* List of existing conversations */}
      <ChatScreenChatsList />

      {/* Active chat window with message thread and message input */}
      <ChatScreenChat />
    </div>
  );
}
