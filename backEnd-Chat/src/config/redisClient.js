const redis = require("redis");
require("dotenv").config();

const redisClient = redis.createClient({
  password: process.env.REDIS_PASS,
  socket: {
    host: process.env.REDIS_HOST,
    port: 10511,
  },
});

redisClient.connect();
redisClient.on("connect", async function() {
  console.log("Connected to Redis!");
});


redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

module.exports = redisClient;
