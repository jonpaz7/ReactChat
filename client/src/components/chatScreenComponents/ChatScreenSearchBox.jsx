import { useState } from "react";
import {
  useChatDataContext,
  useChatActionsContext,
} from "../../context/ChatContext";

export default function ChatScreenSearchBox() {
  const { users, loggedInAccount, openedChat } = useChatDataContext();
  const { openChat } = useChatActionsContext();
  const [searchTerm, setSearchTerm] = useState("");

  // Hide the search box while inside a conversation
  if (openedChat) return null;

  // Filter users: exclude current user and match the search input
  const matchedUsers = users.filter((user) => {
    if (user.userId === loggedInAccount.userId) return false;
    return user.userName
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase());
  });

  const handleSelectUser = (userId) => {
    openChat(userId);
    setSearchTerm("");
  };

  return (
    <div className="relative px-4 py-3 bg-zinc-900 border-b border-zinc-800/80 shrink-0">
      <div className="relative flex items-center">
        <svg
          className="w-4 h-4 text-zinc-500 absolute left-3.5 pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
          />
        </svg>

        <input
          type="text"
          placeholder="Search users to start a chat..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-8 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
        />

        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            className="absolute right-3 text-zinc-500 hover:text-zinc-300 text-xs cursor-pointer"
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Dropdown results — only shown when there is an active search term */}
      {searchTerm && (
        <div className="absolute left-4 right-4 top-[calc(100%-4px)] z-20 bg-zinc-900 border border-zinc-700/80 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto">
          {matchedUsers.length === 0 ? (
            <div className="px-4 py-3 text-sm text-zinc-500 text-center">
              No users found
            </div>
          ) : (
            matchedUsers.map((user) => (
              <div
                key={user.userId}
                onClick={() => handleSelectUser(user.userId)}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-zinc-800/80 cursor-pointer transition-colors border-b border-zinc-800/60 last:border-b-0"
              >
                <img
                  src={user.avatar}
                  alt={user.userName}
                  className="w-8 h-8 rounded-full bg-zinc-800 ring-1 ring-zinc-700 object-cover"
                />
                <span className="text-sm font-medium text-zinc-100">
                  {user.userName}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
