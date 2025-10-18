import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST ?? "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
  // username: process.env.REDIS_USERNAME ?? "default",
  // password: process.env.REDIS_PASSWORD ?? "",
  lazyConnect: true,
});

redis.on("connect", () => {
  console.log("Redis connected!!!");
});

redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});

export default redis;
