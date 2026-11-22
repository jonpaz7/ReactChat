export default function chatHandler(io, socket) {
  socket.on("account_logged_in", (userId) => {
    socket.join(userId);
  });
}
