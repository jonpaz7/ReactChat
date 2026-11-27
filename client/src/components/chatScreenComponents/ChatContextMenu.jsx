import { createPortal } from "react-dom";
import Swal from "sweetalert2";
import {
  useChatActionsContext,
  useChatDataContext,
} from "../../context/ChatContext";

export default function ChatContextMenu({ data }) {
  const { deleteMessage, editMessage } = useChatActionsContext();
  const { loggedInAccount } = useChatDataContext();
  const { msg, x, y, close } = data;

  const isMyMessage = msg.senderId === loggedInAccount.userId;

  const handleDelete = () => {
    close();

    if (isMyMessage) {
      // Owner can delete for everyone or just hide it for themselves
      Swal.fire({
        title: "Delete message",
        text: "Who should this be deleted for?",
        showConfirmButton: true,
        confirmButtonText: "Delete for everyone",
        showDenyButton: true,
        denyButtonText: "Delete for me only",
        showCancelButton: true,
      }).then((result) => {
        if (result.isConfirmed)
          deleteMessage(msg.messageId, "permanent", loggedInAccount.userId);
        else if (result.isDenied)
          deleteMessage(msg.messageId, "hide", loggedInAccount.userId);
      });
    } else {
      // Non-owners can only hide the message on their end
      Swal.fire({
        title: "Hide message",
        text: "This will only remove it from your view.",
        showDenyButton: true,
        denyButtonText: "Hide for me",
        showCancelButton: true,
        showConfirmButton: false,
      }).then((result) => {
        if (result.isDenied)
          deleteMessage(msg.messageId, "hide", loggedInAccount.userId);
      });
    }
  };

  const handleEdit = () => {
    close();
    Swal.fire({
      title: "Edit message",
      input: "text",
      inputValue: msg.content,
      showCancelButton: true,
      confirmButtonText: "Save",
      inputValidator: (value) => {
        if (!value.trim()) return "Message cannot be empty";
      },
    }).then((result) => {
      if (result.isConfirmed) editMessage(msg.messageId, result.value.trim());
    });
  };

  return createPortal(
    // Transparent full-screen overlay — clicking it closes the menu
    <div
      onClick={close}
      onContextMenu={(e) => {
        e.preventDefault();
        close();
      }}
      className="fixed inset-0 z-[9998]"
    >
      {/* The actual context menu panel */}
      <div
        onClick={(e) => e.stopPropagation()} // prevent overlay click from firing inside the menu
        style={{ top: y, left: x }}
        className="fixed z-[9999] min-w-[175px] bg-zinc-900 border border-zinc-700/80 rounded-xl shadow-2xl py-1.5 overflow-hidden"
      >
        <ul className="list-none m-0 p-0 text-sm">
          {isMyMessage && (
            <li
              onClick={handleEdit}
              className="flex items-center gap-2.5 px-3.5 py-2 text-zinc-200 hover:bg-zinc-800 cursor-pointer transition-colors"
            >
              <svg
                className="w-4 h-4 text-amber-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              <span>Edit message</span>
            </li>
          )}
          <li
            onClick={handleDelete}
            className="flex items-center gap-2.5 px-3.5 py-2 text-red-400 hover:bg-red-500/10 cursor-pointer transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <span>Delete message</span>
          </li>
        </ul>
      </div>
    </div>,
    document.body,
  );
}
