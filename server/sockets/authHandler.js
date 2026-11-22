import { createAccount } from "../data/store.js";

export default function authHandlers(io, socket) {
  socket.on("create_account", (data) => {
    const newAccount = createAccount(data);

    io.emit("account_created", newAccount);
  });
}
