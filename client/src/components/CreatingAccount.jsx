import { useState } from "react";
import { useChatActionsContext } from "../context/ChatContext";
import Swal from "sweetalert2";

// Registration form component for creating a new account
export default function CreatingAccount() {
  const { createAccount } = useChatActionsContext();

  // Form input state
  const [credentials, setCredentials] = useState({
    userName: "",
    userPassword: "",
  });

  // Track changes to inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate inputs and trigger account creation
  const handleSubmit = (e) => {
    e.preventDefault();

    // Prevent submission if fields are empty
    if (!credentials.userName.trim() || !credentials.userPassword.trim()) {
      Swal.fire({
        title: "Missing Details",
        timer: 1000,
        showConfirmButton: false,
      });
      return;
    }

    // Call creation handler and reset form on success
    const isSuccess = createAccount(credentials);

    if (isSuccess) {
      Swal.fire({
        title: "Account Created Successfully",
        timer: 1000,
        showConfirmButton: false,
      });
      setCredentials({
        userName: "",
        userPassword: "",
      });
    }
  };

  // Render registration form UI
  return (
    <div style={{ margin: " 0 auto" }}>
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
        <label htmlFor="userName">What is your name</label>
        <input
          type="text"
          name="userName"
          id="userName"
          placeholder="Israel Nahari"
          value={credentials.userName}
          onChange={handleInputChange}
        />
        <label htmlFor="userPassword">Choose a password</label>
        <input
          type="password"
          name="userPassword"
          id="userPassword"
          placeholder="Israel Nahari"
          value={credentials.userPassword}
          onChange={handleInputChange}
        />
        <button type="submit">Create Account</button>
      </form>
    </div>
  );
}
