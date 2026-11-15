import {
  createContext,
  useState,
  useEffect,
  children,
  useContext,
} from "react";
import Swal from "sweetalert2";

export default function ChatContext({ children }) {
  /*========================== Data ============================*/
  const [users, setUsers] = useState(() => loadData("users"));
  const [chats, setChats] = useState(() => loadData("chats"));
  const [messages, setMessages] = useState(() => loadData("messages"));
  const [loggedInAccountUsrName, setLoggedInAccountUsrName] = useState("1");
  const [openedChatID, setOpendChatID] = useState(null);

  const loggedInAccount = users.find(
    (acc) => acc.userName === loggedInAccountUsrName,
  );
  const openedChat = chats.find((chat) => chat.chatID === openedChatID);
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
      userID: `usr_${crypto.randomUUID()}`,
      userName: userName.trim(),
      userPassword: userPassword.trim(),
      avatar: `https://api.dicebear.com/10.x/personas/svg?seed=${userName.trim()}`,
    };

    setUsers((prevUsers) => [...prevUsers, newUser]);
    setLoggedInAccountUsrName(newUser.userName);
    return true;
  };

  const loginAccount = ({ userName, userPassword }) => {
    const loggingAccount = users.find((usr) => usr.userName === userName);

    if (!loggingAccount || loggingAccount.userPassword !== userPassword) {
      Swal.fire({
        title: "Wrong Details",
        text: "One or more details is wrong",
        timer: 2000,
        showConfirmButton: false,
      });
      return false;
    }

    setLoggedInAccountUsrName(loggingAccount.userName);
    return true;
  };

  const openChat = (userName) => {
    let selectedChat = chats.find((chat) => {
      return (
        chat.participants.includes(loggedInAccount.userName) &&
        chat.participants.includes(userName)
      );
    });

    if (!selectedChat) {
      selectedChat = createChat(userName);
    }

    setOpendChatID(selectedChat.chatID);
  };

  const createChat = (userName) => {
    const newChat = {
      chatID: `chat_${crypto.randomUUID()}`,
      participants: [loggedInAccount.userName, userName],
    };

    setChats((prevChats) => [...prevChats, newChat]);
    return newChat;
  };
  /*========================== Configurations ============================*/
  const chatData = {
    loggedInAccount,
    setLoggedInAccountUsrName,
    users,
    openedChat,
    chats,
  };
  const chatActions = { createAccount, loginAccount, openChat };

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
