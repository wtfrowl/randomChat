const redisClient = require("../config/redisClient");

const userPoolKey = "user_pool";

const addUserToPool = async (userId) => {
  try {
    await redisClient.sAdd(userPoolKey, userId);
  } catch (err) {
    console.error("Error adding user to pool:", err);
  }
};

const removeUserFromPool = async (userId) => {
  try {
    await redisClient.sRem(userPoolKey, userId);
  } catch (err) {
    console.error("Error removing user from pool:", err);
  }
};

const getUsersInPool = async () => {
  try {
    const users = await redisClient.sMembers(userPoolKey);
    return users;
  } catch (err) {
    console.error("Error fetching users from pool:", err);
    return [];
  }
};

const getUserCountInPool = async () => {
  try {
    const count = await redisClient.sCard(userPoolKey);
    // console.log(count)
    return count;
  } catch (err) {
    console.error("Error counting users in pool:", err);
    return 0;
  }
};

module.exports = {
  addUserToPool,
  removeUserFromPool,
  getUsersInPool,
  getUserCountInPool,
};
