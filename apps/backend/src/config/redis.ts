import Redis from 'ioredis';
import env from './env.js';
import { isDevOrTest } from './environment.js';

let redis: any;

const redisOptions = {
  maxRetriesPerRequest: null,
  keepAlive: 10000,
  connectTimeout: 5000,
  enableReadyCheck: true,
  retryStrategy(times: number) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
};

if (isDevOrTest || !env.REDIS_URL || env.REDIS_URL.includes('localhost') || env.REDIS_URL.includes('127.0.0.1')) {
  try {
    const RedisMock = require('ioredis-mock');
    redis = new RedisMock();
    console.log('[REDIS] Using in-memory Redis mock (no external Redis required).');
  } catch (err) {
    redis = new Redis(env.REDIS_URL || 'redis://localhost:6379', redisOptions);
  }
} else {
  redis = new Redis(env.REDIS_URL, redisOptions);
}

redis.on('error', (err: any) => {
  // Silent warning instead of crashing
  console.warn('[REDIS WARNING]: Redis not connected, falling back gracefully:', err.message);
});

export { redis };
export default redis;
