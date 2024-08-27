const { addUserToPool } = require('../services/poolService');
const matchUsers = require('../services/matchService');

const handleConnection = (socket) => {
  console.log('A user connected:', socket.id);

  // Add user to the pool and attempt to match
  addUserToPool(socket.id);
  matchUsers();

  // Handle user messages
  socket.on('message', (message) => {
    console.log('Message from', socket.id, ':', message);
    // Forward the message to the connected partner
    socket.to(message.to).emit('message', { from: socket.id, text: message.text });
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Add the user back to the pool and attempt to match again
    addUserToPool(socket.id);
    matchUsers();
  });
};

module.exports = handleConnection;
