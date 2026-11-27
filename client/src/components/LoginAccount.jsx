import { useState } from "react";
import { useChatActionsContext } from "../context/ChatContext";
import Swal from "sweetalert2";

export default function LoginAccount() {
  const { loginAccount } = useChatActionsContext();

  const [credentials, setCredentials] = useState({
    userName: "",
    userPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  // Validate and submit the login form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!credentials.userName.trim() || !credentials.userPassword.trim()) {
      Swal.fire({
        title: "Please fill in all fields",
        icon: "warning",
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

    setIsSubmitting(true);
    const success = await loginAccount(credentials);
    setIsSubmitting(false);

    if (success) {
      setCredentials({ userName: "", userPassword: "" });
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="login-username"
          className="text-xs font-medium uppercase tracking-wider text-zinc-400"
        >
          Username
        </label>
        <input
          type="text"
          name="userName"
          id="login-username"
          placeholder="Israel Israeli"
          value={credentials.userName}
          onChange={handleInputChange}
          autoComplete="username"
          autoFocus
          className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="login-password"
          className="text-xs font-medium uppercase tracking-wider text-zinc-400"
        >
          Password
        </label>
        <input
          type="password"
          name="userPassword"
          id="login-password"
          placeholder="••••••••"
          value={credentials.userPassword}
          onChange={handleInputChange}
          autoComplete="current-password"
          className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-950 font-semibold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/10 cursor-pointer"
      >
        {isSubmitting ? "Logging in..." : "Sign In"}
      </button>
    </form>
  );
}
