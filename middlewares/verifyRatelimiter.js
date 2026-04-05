const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const verifyRatelimiter = (limiter) => {
  return async (req, res, next) => {
    try {
      await delay(100 + Math.random() * 200);

      const key = req.user?.id || req.ip;

      await limiter.consume(key);

      next();
    } catch {
      res.status(429).json({ error: "Too many requests" });
    }
  };
};

export default verifyRatelimiter;
