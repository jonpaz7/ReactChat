import { useCallback, useState } from "react";
import {
  useChatDataContext,
  useChatActionsContext,
} from "../../context/ChatContext";

export default function ChatScreenSearchBox() {
  const { users, loggedInAccount, openedChat } = useChatDataContext();
  const { openChat } = useChatActionsContext();
  const [searchTerm, setSearchTerm] = useState("");

  if (openedChat) return;

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (openedChat) return;
  return (
    <>
      <div style={{}}>
        <input
          type="text"
          placeholder="Search for chats"
          value={searchTerm}
          style={{ width: "90%", margin: "2px auto" }}
          onChange={handleChange}
        />
        {searchTerm && (
          <div style={{ position: "relative" }}>
            {users
              .filter((usr) => {
                if (
                  searchTerm.trim().toLowerCase() === loggedInAccount.userName
                )
                  return false;
                return usr.userName
                  .toLowerCase()
                  .includes(searchTerm.trim().toLowerCase());
              })
              .map((usr) => {
                return (
                  <div
                    key={usr.userID}
                    style={{ border: "1px solid silver", height: "20px" }}
                    onClick={() => {
                      openChat(usr.userID);
                      setSearchTerm("");
                    }}
                  >
                    <h4 style={{ margin: "0px" }}>{usr.userName}</h4>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </>
  );
}
