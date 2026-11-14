import {
  createContext,
  useState,
  useEffect,
  Children,
  useContext,
} from "react";
import Swal from "sweetalert2";

export default function ChatContext({ children }) {
  /*========================== Data ============================*/
  const [users, setUsers] = useState(() => loadData("users"));
  const [chats, setChats] = useState(() => loadData("chats"));
  const [messages, setMessages] = useState(() => loadData("messages"));
  /*========================== Side Effects ============================*/
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("chats", JSON.stringify(chats));
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [users, chats, messages]);
  /*========================== Functions ============================*/
  function loadData(dataType) {
    const savedData = localStorage.getItem(dataType);
    return savedData && savedData !== "undefined" ? JSON.parse(savedData) : [];
  }

  const createAccount = ({ userName, userPassword }) => {
    if (
      users.some(
        (usr) => usr.userName.toLowerCase() === userName.trim().toLowerCase(),
      )
    ) {
      Swal.fire({
        title: "User Name already taken",
        timer: 2000,
      });
      return false;
    }

    const newUser = {
      userID: `usr_${crypto.randomUUID}`,
      userName: userName.trim(),
      userPassword: userPassword.trim(),
      avatar: `https://api.dicebear.com/10.x/personas/svg?seed=${userName.trim()}`,
    };

    setUsers((prevUsers) => [...prevUsers, newUser]);
    return true;
  };
  /*========================== Configurations ============================*/
  const chatData = {};
  const chatActions = { createAccount };
  return (
    <ChatDataContext.Provider value={chatData}>
      <ChatActionsContext.Provider value={chatActions}>
        {children}
      </ChatActionsContext.Provider>
    </ChatDataContext.Provider>
  );
}

export const ChatDataContext = createContext(null);
export const ChatActionsContext = createContext(null);

export const useChatDataContext = () => {
  return useContext(ChatDataContext);
};
export const useChatActionsContext = () => {
  return useContext(ChatActionsContext);
};
