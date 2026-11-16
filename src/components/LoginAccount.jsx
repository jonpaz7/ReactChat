import { useState } from "react";
import { useChatActionsContext } from "../context/ChatContext";
import Swal from "sweetalert2";

export default function LoginAccount() {
  const { loginAccount } = useChatActionsContext();

  const [credentials, setCredentials] = useState({
    userName: "",
    userPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!credentials.userName.trim() || !credentials.userPassword.trim()) {
      Swal.fire({
        title: "Missing Details",
        timer: 1000,
        showConfirmButton: false,
      });
      return;
    }

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
