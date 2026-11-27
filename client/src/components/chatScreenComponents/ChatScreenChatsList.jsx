import { useChatDataContext } from "../../context/ChatContext";

export default function ChatScreenChatsList() {
  const { users, chats, loggedInAccount, setOpenedChatId, openedChat } =
    useChatDataContext();

  // Hide the list while a conversation is open
  if (openedChat) return null;

  const myChats = chats.filter((chat) =>
    chat.participants?.includes(loggedInAccount.userId),
  );

  if (myChats.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-zinc-950/40">
        <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-3">
          <svg
            className="w-6 h-6 text-zinc-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
        <p className="text-sm font-medium text-zinc-300">No conversations yet</p>
        <p className="text-xs text-zinc-500 mt-1">
          Search for a user above to start chatting.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto divide-y divide-zinc-800/60 bg-zinc-950/40">
      {myChats.map((chat) => {
        const otherUserId = chat.participants.find(
          (id) => id !== loggedInAccount.userId,
        );
        const otherParticipant = users.find((u) => u.userId === otherUserId);

        // Guard against a participant whose data isn't loaded yet
        if (!otherParticipant) return null;

        return (
          <div
            key={chat.chatId}
            onClick={() => setOpenedChatId(chat.chatId)}
            title={`Open chat with ${otherParticipant.userName}`}
            className="flex items-center justify-between px-4 py-3.5 hover:bg-zinc-800/50 cursor-pointer transition-colors group"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <img
                src={otherParticipant.avatar}
                alt={otherParticipant.userName}
                className="w-10 h-10 rounded-full bg-zinc-800 ring-1 ring-zinc-700 group-hover:ring-amber-500/50 transition-all object-cover shrink-0"
              />
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-zinc-100 truncate m-0">
                  {otherParticipant.userName}
                </h3>
                <p className="text-xs text-zinc-500 m-0 mt-0.5">
                  Click to open conversation
                </p>
              </div>
            </div>

            <svg
              className="w-4 h-4 text-zinc-600 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        );
      })}
    </div>
  );
}
