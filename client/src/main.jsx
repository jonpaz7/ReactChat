import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import ChatContext from "./context/ChatContext.jsx";

// Mount the React application wrapped with Global ChatContext provider
createRoot(document.getElementById("root")).render(
  //<StrictMode>
  <ChatContext>
    <App />
  </ChatContext>,
  // </StrictMode>,
);
