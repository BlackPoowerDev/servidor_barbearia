import { RateLimiterRedis } from "rate-limiter-flexible";
import Redis from "ioredis";
import "dotenv/config";

const client = new Redis(process.env.REDIS_URL);
await client.set("foo", "bar");

// GLOBAL (API)
export const globalLimiter = new RateLimiterRedis({
  storeClient: client,
  keyPrefix: "global",
  points: 100,
  duration: 60,
  blockDuration: 60,
});

// LOGIN (mais restrito)
export const loginLimiter = new RateLimiterRedis({
  storeClient: client,
  keyPrefix: "login",
  points: 5,
  duration: 60,
  blockDuration: 300,
});

// REGISTER
export const registerLimiter = new RateLimiterRedis({
  storeClient: client,
  keyPrefix: "register",
  points: 10,
  duration: 60,
  blockDuration: 120,
});
