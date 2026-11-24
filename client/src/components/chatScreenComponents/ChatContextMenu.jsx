import { createPortal } from "react-dom";
import Swal from "sweetalert2";
import { useChatActionsContext, useChatDataContext } from "../../context/ChatContext";

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
        if (result.isConfirmed) deleteMessage(msg.messageId, "permanent", loggedInAccount.userId);
        else if (result.isDenied) deleteMessage(msg.messageId, "hide", loggedInAccount.userId);
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
        if (result.isDenied) deleteMessage(msg.messageId, "hide", loggedInAccount.userId);
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
      onContextMenu={(e) => { e.preventDefault(); close(); }}
      style={{ inset: "0", position: "fixed", zIndex: 9998 }}
    >
      {/* The actual context menu panel */}
      <div
        onClick={(e) => e.stopPropagation()} // prevent overlay click from firing inside the menu
        style={{
          position: "fixed",
          top: y,
          left: x,
          backgroundColor: "white",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          padding: "8px 0",
          borderRadius: "8px",
          zIndex: 9999,
          minWidth: "160px",
        }}
      >
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          <li
            onClick={handleDelete}
            style={{ padding: "8px 16px", cursor: "pointer" }}
          >
            🗑 Delete message
          </li>
          {isMyMessage && (
            <li
              onClick={handleEdit}
              style={{ padding: "8px 16px", cursor: "pointer" }}
            >
              ✏️ Edit message
            </li>
          )}
        </ul>
      </div>
    </div>,
    document.body
  );
}
