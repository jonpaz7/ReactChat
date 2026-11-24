// Registers socket event handlers for chat-related real-time events.
// Called once per connection from index.js.
export default function chatHandler(io, socket) {
  // When a user logs in, they join their personal room (keyed by userId).
  // This allows the server to send targeted messages to a specific user.
  socket.on("user_connected", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their personal room`);
  });
}
