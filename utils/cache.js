const redis = require("redis");

const client = redis.createClient();
client.on("error", (err) => console.error("Redis Error:", err));
client.connect();

const setCache = async (key, value, expiry = 600) => {
  await client.setEx(key, expiry, JSON.stringify(value));
};

const getCache = async (key) => {
  const data = await client.get(key);
  return data ? JSON.parse(data) : null;
};

module.exports = { setCache, getCache };
