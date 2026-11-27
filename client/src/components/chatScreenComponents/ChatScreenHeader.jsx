import {
  useChatDataContext,
  useChatActionsContext,
} from "../../context/ChatContext";

export default function ChatScreenHeader() {
  const { loggedInAccount, openedChat, setOpenedChatId, users } =
    useChatDataContext();
  const { logoutAccount } = useChatActionsContext();

  // ── Active chat view — show back button and other participant's name ────────
  if (openedChat) {
    const otherParticipantId = openedChat.participants.find(
      (id) => id !== loggedInAccount.userId,
    );
    const otherParticipant = users.find((u) => u.userId === otherParticipantId);

    return (
      <header className="px-4 py-3 bg-zinc-900/95 border-b border-zinc-800 flex items-center justify-between shrink-0">
        <button
          onClick={() => setOpenedChatId(null)}
          title="Back to chat list"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-800/80 hover:bg-zinc-800 hover:text-zinc-100 border border-zinc-700/60 rounded-lg transition-colors cursor-pointer"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>

        <div className="flex items-center gap-2.5">
          {otherParticipant?.avatar && (
            <img
              src={otherParticipant.avatar}
              alt={otherParticipant.userName}
              className="w-7 h-7 rounded-full bg-zinc-800 ring-1 ring-zinc-700 object-cover"
            />
          )}
          <h4 className="text-sm font-semibold text-zinc-100 m-0">
            {otherParticipant?.userName ?? "Unknown"}
          </h4>
        </div>

        <div className="w-16" />
      </header>
    );
  }

  // ── Default view — app title, logged-in username, and logout ────────────────
  return (
    <header className="px-4 py-3 bg-zinc-900/95 border-b border-zinc-800 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-2.5">
        <img
          src={loggedInAccount.avatar}
          alt={loggedInAccount.userName}
          className="w-8 h-8 rounded-full bg-zinc-800 ring-2 ring-amber-500/40 object-cover"
        />
        <span className="text-sm font-medium text-zinc-200 truncate max-w-[120px] sm:max-w-[180px]">
          {loggedInAccount.userName}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
        <h4 className="text-sm font-bold tracking-tight text-zinc-100 m-0">
          CheatyChat
        </h4>
      </div>

      <button
        onClick={logoutAccount}
        title="Log out"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-800/80 hover:bg-red-500/15 hover:text-red-400 hover:border-red-500/30 border border-zinc-700/60 rounded-lg transition-colors cursor-pointer"
      >
        Logout
      </button>
    </header>
  );
}
