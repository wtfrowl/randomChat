const { getUsersInPool, removeUserFromPool } = require("./poolService");

async function matchUsers(io) {
  try {
    const users = await getUsersInPool();
    if (users.length >= 2) {
      const user1 = users[Math.floor(Math.random() * users.length)];
      const user2 = users.find((user) => user !== user1);

      await removeUserFromPool(user1);
      await removeUserFromPool(user2);

      // Notify users that they've been matched
      io.to(user1).emit("matched", { partnerId: user2 });
      io.to(user2).emit("matched", { partnerId: user1 });
    }
  } catch (err) {
    console.error("Error matching users:", err);
  }
}

// Export the function properly
module.exports = matchUsers;
