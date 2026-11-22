import { useState } from "react";
import CreatingAccount from "./components/CreatingAccount";
import LoginAccount from "./components/LoginAccount";
import ChatScreen from "./components/ChatScreen";
import "./App.css";
import { useChatDataContext } from "./context/ChatContext";

// Main application component: toggles auth forms and chat view based on login state
function App() {
  // Read current logged-in user from context
  const { loggedInAccount } = useChatDataContext();

  return (
    <>
      {/* Show registration and login forms if user is not logged in */}
      {!loggedInAccount && <CreatingAccount />}
      {!loggedInAccount && <LoginAccount />}

      {/* Show chat dashboard if user is authenticated */}
      {loggedInAccount && <ChatScreen />}
    </>
  );
}

export default App;
