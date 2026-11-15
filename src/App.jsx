import { useState } from "react";
import CreatingAccount from "./components/CreatingAccount";
import LoginAccount from "./components/LoginAccount";
import ChatScreen from "./components/ChatScreen";
import "./App.css";
import { useChatDataContext } from "./context/ChatContext";

function App() {
  const { loggedInAccount } = useChatDataContext();
  return (
    <>
      {!loggedInAccount && <CreatingAccount />}
      {!loggedInAccount && <LoginAccount />}
      {loggedInAccount && <ChatScreen />}
    </>
  );
}

export default App;
