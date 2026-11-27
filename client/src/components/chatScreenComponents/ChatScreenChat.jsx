import { useEffect, useRef, useState } from "react";
import {
  useChatDataContext,
  useChatActionsContext,
} from "../../context/ChatContext";
import ChatContextMenu from "./ChatContextMenu";

export default function ChatScreenChat() {
  const { openedChat, messages, loggedInAccount, users } = useChatDataContext();
  const { sendMessage } = useChatActionsContext();

  const [draftMessage, setDraftMessage] = useState("");
  const [contextMenu, setContextMenu] = useState(null); // { msg, x, y } or null
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to the latest message whenever the message list or active chat changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, openedChat?.chatId]);

  // Auto-focus the input field when a chat is opened
  useEffect(() => {
    if (openedChat) inputRef.current?.focus();
  }, [openedChat?.chatId]);

  // Close context menu when pressing Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setContextMenu(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!openedChat) return null;

  // Filter messages: only show messages that belong to this chat and haven't been hidden by the current user
  const visibleMessages = messages.filter((msg) => {
    if (msg.chatId !== openedChat.chatId) return false;
    const isHiddenByMe = msg.deleterId?.includes(loggedInAccount.userId);
    return !isHiddenByMe;
  });

  const handleSend = () => {
    const trimmed = draftMessage.trim();
    if (!trimmed) return;
    sendMessage(openedChat.chatId, "text", trimmed);
    setDraftMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const openContextMenu = (e, msg) => {
    e.preventDefault();
    setContextMenu({ msg, x: e.clientX, y: e.clientY });
  };

  return (
    <>
      {contextMenu && (
        <ChatContextMenu
          data={{ ...contextMenu, close: () => setContextMenu(null) }}
        />
      )}

      <div className="flex-1 flex flex-col min-h-0 bg-zinc-950/60">
        {/* Scrollable message list */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2.5">
          {visibleMessages.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
              <p className="text-sm text-zinc-500">
                No messages yet. Say hello! 👋
              </p>
            </div>
          )}

          {visibleMessages.map((msg) => {
            const isMine = msg.senderId === loggedInAccount.userId;
            const sender = users.find((u) => u.userId === msg.senderId);
            const senderName = sender?.userName ?? "Unknown";

            return (
              <div
                key={msg.messageId}
                onContextMenu={(e) => openContextMenu(e, msg)}
                title="Right-click for options"
                className={`max-w-[78%] sm:max-w-[70%] px-3.5 py-2 text-sm leading-relaxed select-text cursor-default transition-all ${
                  isMine
                    ? "ml-auto bg-amber-500 text-zinc-950 rounded-2xl rounded-br-sm shadow-md shadow-amber-500/10"
                    : "mr-auto bg-zinc-800/90 text-zinc-100 border border-zinc-700/60 rounded-2xl rounded-bl-sm"
                }`}
              >
                {!isMine && (
                  <div className="text-[11px] font-semibold text-amber-400 mb-0.5">
                    {senderName}
                  </div>
                )}
                <p className="m-0 break-words whitespace-pre-wrap">
                  {msg.content}
                </p>
              </div>
            );
          })}

          {/* Invisible anchor used for auto-scrolling to the bottom */}
          <div ref={messagesEndRef} />
        </div>

        {/* Message input bar */}
        <div className="p-3 bg-zinc-900 border-t border-zinc-800 flex items-center gap-2 shrink-0">
          <input
            ref={inputRef}
            placeholder="Type a message... (Enter to send)"
            value={draftMessage}
            onChange={(e) => setDraftMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!draftMessage.trim()}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-950 font-semibold text-sm rounded-xl transition-all cursor-pointer shrink-0"
          >
            <span>Send</span>
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 12h14M12 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
