import { useState } from "react";
import { useChatActionsContext } from "../context/ChatContext";
import Swal from "sweetalert2";

export default function CreatingAccount() {
  const { createAccount } = useChatActionsContext();

  const [credentials, setCredentials] = useState({ userName: "", userPassword: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  // Validate and submit the registration form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!credentials.userName.trim() || !credentials.userPassword.trim()) {
      Swal.fire({ title: "Please fill in all fields", icon: "warning", timer: 1500, showConfirmButton: false });
      return;
    }

    setIsSubmitting(true);
    const success = await createAccount(credentials);
    setIsSubmitting(false);

    if (success) {
      setCredentials({ userName: "", userPassword: "" });
    }
  };

  return (
    <div style={{ margin: "0 auto" }}>
      <h1>Create Your Account</h1>
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
        <label htmlFor="register-username">What is your name</label>
        <input
          type="text"
          name="userName"
          id="register-username"
          placeholder="Israel Israeli"
          value={credentials.userName}
          onChange={handleInputChange}
          autoComplete="username"
        />
        <label htmlFor="register-password">Choose a password</label>
        <input
          type="password"
          name="userPassword"
          id="register-password"
          placeholder="••••••••"
          value={credentials.userPassword}
          onChange={handleInputChange}
          autoComplete="new-password"
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Account"}
        </button>
      </form>
    </div>
  );
}
