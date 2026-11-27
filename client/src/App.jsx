import { useState } from "react";
import CreatingAccount from "./components/CreatingAccount";
import LoginAccount from "./components/LoginAccount";
import ChatScreen from "./components/ChatScreen";
import { useChatDataContext } from "./context/ChatContext";

// Main application component: toggles auth forms and chat view based on login state
function App() {
  const { loggedInAccount } = useChatDataContext();
  const [authMode, setAuthMode] = useState("login"); // "login" | "register"

  if (loggedInAccount) {
    return (
      <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 flex items-center justify-center md:p-6">
        <ChatScreen />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle industrial radial glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-amber-500/10 blur-[120px] rounded-full" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-3 shadow-lg shadow-amber-500/5">
            <svg
              className="w-6 h-6 text-amber-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
            CheatyChat
          </h1>
          <p className="text-xs uppercase tracking-widest text-zinc-500 mt-1">
            Real-Time Messaging
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-2xl p-6">
          {/* Mode Switcher */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-zinc-950 rounded-xl border border-zinc-800/80 mb-6">
            <button
              type="button"
              onClick={() => setAuthMode("login")}
              className={`py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${
                authMode === "login"
                  ? "bg-zinc-800 text-zinc-100 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setAuthMode("register")}
              className={`py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${
                authMode === "register"
                  ? "bg-zinc-800 text-zinc-100 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Create Account
            </button>
          </div>

          {authMode === "login" ? <LoginAccount /> : <CreatingAccount />}
        </div>
      </div>
    </div>
  );
}

export default App;
