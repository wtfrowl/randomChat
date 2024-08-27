const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const app = express();
const poolService = require("./services/poolService");
const matchService = require("./services/matchService");

require("dotenv").config();

app.get("/totalUsers", async (req, res) => {
  // Emit the total count of users in the pool when a user connects
  const userCount = await poolService.getUserCountInPool();
  res.status(200).json({ data: userCount + 2345 });
});

// CORS options
const corsOptions = {
  origin: process.env.ORIGIN, // Allow requests from this origin
  methods: ["GET", "POST"], // Allowed methods
  allowedHeaders: ["Content-Type", "Authorization", "my-custom-header"], // Allowed headers
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

// Apply CORS middleware with the specified options
app.use(cors(corsOptions));

app.get("/totalUsers", async (req, res) => {
  // Emit the total count of users in the pool when a user connects
  const userCount = await poolService.getUserCountInPool();
  res.status(200).json({ data: userCount + 2345 });
});



//server config
// Start the server
const PORT = process.env.PORT || 3010;


const server = http.createServer(app);

const io = socketIo(server, {
  cors: corsOptions, // Use the same CORS options for socket.io
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});





module.exports.io = io;

io.on("connection", async (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("joinQueue", async () => {
    poolService.addUserToPool(socket.id);
    matchService(io); // Try to match users whenever a new user joins
  });

  socket.on("sendMessage", (data) => {
    io.to(data.to).emit("message", { message: data.message, uid: socket.id });
  });

  socket.on("disconnectChat", async ({ partnerId }) => {
    io.to(partnerId).emit("partnerDisconnected", { partnerId: socket.id });
    await poolService.removeUserFromPool(socket.id);
    // Update all clients with the new user count
    const userCount = await poolService.getUserCountInPool();
    io.emit("userCountUpdate", { count: userCount });
    socket.disconnect();
  });

  socket.on("disconnect", async () => {
    console.log("A user disconnected:", socket.id);
    await poolService.removeUserFromPool(socket.id);
    // Update all clients with the new user count
    const userCount = await poolService.getUserCountInPool();
    io.emit("userCountUpdate", { count: userCount });
  });
});


