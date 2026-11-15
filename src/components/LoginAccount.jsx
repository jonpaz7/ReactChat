import { useChatActionsContext } from "../context/ChatContext";
import { useState } from "react";
import Swal from "sweetalert2";

export default function LoginAccount() {
  const { loginAccount } = useChatActionsContext();

  const [formData, setFormData] = useState({
    userName: "",
    userPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: value,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.userName.trim() || !formData.userPassword.trim()) {
      Swal.fire({
        title: "Missing Details",
        timer: 1000,
        showConfirmButton: false,
      });
      return;
    }

    console.log(formData);
    const isSuccess = loginAccount(formData);

    if (isSuccess) {
      Swal.fire({
        title: "Logged In Successfuly",
        timer: 1000,
        showConfirmButton: false,
      });
      setFormData({
        userName: "",
        userPassword: "",
      });
    }
  };

  return (
    <>
      <h1>Log Into Your Account</h1>

      <form
        style={{
          display: "flex",
          flexDirection: "column",
          width: "fit-content",
          alignItems: "center",
          margin: "0px auto",
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
          value={formData.userName}
          onChange={handleChange}
        />
        <label htmlFor="userPassword">Enter your password</label>
        <input
          type="text"
          name="userPassword"
          id="userPassword"
          placeholder="Israel Nahari"
          value={formData.userPassword}
          onChange={handleChange}
        />
        <button type="submit">Login</button>
      </form>
    </>
  );
}
