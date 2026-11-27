import ChatScreenHeader from "./chatScreenComponents/ChatScreenHeader";
import ChatScreenChatsList from "./chatScreenComponents/ChatScreenChatsList";
import ChatScreenSearchBox from "./chatScreenComponents/ChatScreenSearchBox";
import ChatScreenChat from "./chatScreenComponents/ChatScreenChat";

// Container component for the main chat interface
export default function ChatScreen() {
  return (
    <div className="w-full max-w-4xl h-screen md:h-[85vh] bg-zinc-900 border-x md:border border-zinc-800 md:rounded-2xl shadow-2xl flex flex-col overflow-hidden">
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
