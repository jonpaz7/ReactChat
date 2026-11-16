import { createPortal } from "react-dom";
import Swal from "sweetalert2";
import { useChatActionsContext } from "../../context/ChatContext";

export default function ChatContextMenu({ data }) {
  const { deleteMessage } = useChatActionsContext();
  const { msgId, x, y, close } = data;

  const handleDelete = () => {
    Swal.fire({
      title: "Delete Message",
      text: "Are you sure?",
      showConfirmButton: true,
      confirmButtonText: "Delete for Both Sides",
      showDenyButton: true,
      denyButtonText: "Delete Only for Me",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) deleteMessage(msgId, "permanent");
      else if (result.isDenied) deleteMessage(msgId, "hide");
    });
  };
  return createPortal(
    <div onClick={() => close()} style={{ inset: "0", position: "absolute" }}>
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
        </li>
      </div>
    </div>,
    document.body,
  );
}
