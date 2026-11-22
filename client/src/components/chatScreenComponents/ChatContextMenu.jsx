import { createPortal } from "react-dom";
import Swal from "sweetalert2";
import {
  useChatActionsContext,
  useChatDataContext,
} from "../../context/ChatContext";

// Context menu overlay rendered via React Portal for message actions (edit/delete)
export default function ChatContextMenu({ data }) {
  const { deleteMessage, editMessage } = useChatActionsContext();
  const { loggedInAccount } = useChatDataContext();
  const { msg, x, y, close } = data;

  // Check if current user is the author of this message
  const isMsgOwner = msg.senderId == loggedInAccount.userId;

  // Open confirmation modal to delete message (hide locally vs delete globally)
  const handleDelete = () => {
    // If owner: allow choice between deleting for both or hiding for self
    isMsgOwner &&
      Swal.fire({
        title: "Delete Message",
        text: "Are you sure?",
        showConfirmButton: true,
        confirmButtonText: "Delete for Both Sides",
        showDenyButton: true,
        denyButtonText: "Delete Only for Me",
        showCancelButton: true,
      }).then((result) => {
        if (result.isConfirmed)
          deleteMessage(msg.messageId, "permanent", loggedInAccount.userId);
        else if (result.isDenied)
          deleteMessage(msg.messageId, "hide", loggedInAccount.userId);
      });

    // If not owner: allow hiding only for current user
    !isMsgOwner &&
      Swal.fire({
        title: "Delete Message",
        text: "Are you sure?",
        showConfirmButton: false,
        showDenyButton: true,
        denyButtonText: "Delete Only for Me",
        showCancelButton: true,
      }).then((result) => {
        if (result.isDenied)
          deleteMessage(msg.messageId, "hide", loggedInAccount.userId);
      });
  };

  // Open popup input to edit message content
  const handleEdit = () => {
    Swal.fire({
      title: "Edit Message",
      input: "text",
      inputValue: msg.content,
      showCancelButton: true,
      showConfirmButton: true,
    }).then((res) => {
      if (res.isConfirmed) editMessage(msg.messageId, res.value);
    });
  };

  // Render context menu popup portal attached directly to document.body
  return createPortal(
    <div
      onClick={() => close()}
      onContextMenu={(e) => {
        e.preventDefault();
        close();
      }}
      style={{ inset: "0", position: "absolute" }}
    >
      <div
        style={{
          position: "fixed",
          top: y,
          left: x,
          backgroundColor: "white",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          padding: "12px",
          borderRadius: "8px",
          zIndex: 9999,
        }}
      >
        <li>
          <ul onClick={handleDelete}>Delete Message</ul>
          {isMsgOwner && <ul onClick={handleEdit}>Edit Message</ul>}
        </li>
      </div>
    </div>,
    document.body,
  );
}
