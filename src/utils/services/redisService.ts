import Redis from 'ioredis';
export const redis = new Redis(process.env.REDIS_URL!);

// blacklist helpers
export const blacklistToken = async (jti: string, exp: number) => {
  const ttlSec = exp - Math.floor(Date.now() / 1000);
  if (ttlSec > 0) await redis.setex(`bl:${jti}`, ttlSec, '1');
}

export const isBlacklisted = (jti: string) =>
  redis.exists(`bl:${jti}`);