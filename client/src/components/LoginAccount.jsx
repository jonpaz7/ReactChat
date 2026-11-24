import { useState } from "react";
import { useChatActionsContext } from "../context/ChatContext";
import Swal from "sweetalert2";

export default function LoginAccount() {
  const { loginAccount } = useChatActionsContext();

  const [credentials, setCredentials] = useState({ userName: "", userPassword: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  // Validate and submit the login form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!credentials.userName.trim() || !credentials.userPassword.trim()) {
      Swal.fire({ title: "Please fill in all fields", icon: "warning", timer: 1500, showConfirmButton: false });
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
    <div style={{ margin: "0 auto" }}>
      <h1>Log Into Your Account</h1>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          width: "fit-content",
          alignItems: "center",
          margin: "0 auto",
          gap: "5px",
        }}
        onSubmit={handleSubmit}
      >
        <label htmlFor="login-username">Username</label>
        <input
          type="text"
          name="userName"
          id="login-username"
          placeholder="Israel Israeli"
          value={credentials.userName}
          onChange={handleInputChange}
          autoComplete="username"
          autoFocus
        />
        <label htmlFor="login-password">Password</label>
        <input
          type="password"
          name="userPassword"
          id="login-password"
          placeholder="••••••••"
          value={credentials.userPassword}
          onChange={handleInputChange}
          autoComplete="current-password"
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
