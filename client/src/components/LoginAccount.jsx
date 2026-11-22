import { useState } from "react";
import { useChatActionsContext } from "../context/ChatContext";
import Swal from "sweetalert2";

// Login form component to authenticate an existing user
export default function LoginAccount() {
  const { loginAccount } = useChatActionsContext();

  // Form input state
  const [credentials, setCredentials] = useState({
    userName: "",
    userPassword: "",
  });

  // Track changes to form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate credentials and trigger login action
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

    // Call login handler and clear form inputs on success
    const isSuccess = loginAccount(credentials);

    if (isSuccess) {
      Swal.fire({
        title: "Logged In Successfully",
        timer: 1000,
        showConfirmButton: false,
      });
      setCredentials({
        userName: "",
        userPassword: "",
      });
    }
  };

  // Render login form UI
  return (
    <div style={{ margin: " 0 auto" }}>
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
        <label htmlFor="userName">Enter your user name</label>
        <input
          type="text"
          name="userName"
          id="userName"
          placeholder="Israel Nahari"
          value={credentials.userName}
          onChange={handleInputChange}
        />
        <label htmlFor="userPassword">Enter your password</label>
        <input
          type="password"
          name="userPassword"
          id="userPassword"
          placeholder="Israel Nahari"
          value={credentials.userPassword}
          onChange={handleInputChange}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
