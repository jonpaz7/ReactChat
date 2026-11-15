import { useState } from "react";
import { useChatActionsContext } from "../context/ChatContext";
import Swal from "sweetalert2";

export default function CreatingAccount() {
  const { createAccount } = useChatActionsContext();

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
    const isSuccess = createAccount(formData);

    if (isSuccess) {
      Swal.fire({
        title: "Account Created Successfuly",
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
      <h1>Create Your Account</h1>

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
        <label htmlFor="userName">What is your name</label>
        <input
          type="text"
          name="userName"
          id="userName"
          placeholder="Israel Nahari"
          value={formData.userName}
          onChange={handleChange}
        />
        <label htmlFor="userPassword">Choose a password</label>
        <input
          type="text"
          name="userPassword"
          id="userPassword"
          placeholder="Israel Nahari"
          value={formData.userPassword}
          onChange={handleChange}
        />
        <button type="submit">Create Account</button>
      </form>
    </>
  );
}
