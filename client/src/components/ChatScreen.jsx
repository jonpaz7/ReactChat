import ChatScreenHeader from "./chatScreenComponents/ChatScreenHeader";
import ChatScreenChatsList from "./chatScreenComponents/ChatScreenChatsList";
import ChatScreenSearchBox from "./chatScreenComponents/ChatScreenSearchBox";
import ChatScreenChat from "./chatScreenComponents/ChatScreenChat";

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
      <ChatScreenHeader />
      <ChatScreenSearchBox />
      <ChatScreenChatsList />
      <ChatScreenChat />
    </div>
  );
}
