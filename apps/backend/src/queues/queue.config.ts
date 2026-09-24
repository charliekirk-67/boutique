import env from '../config/env.js';

let url: URL;
try {
  url = new URL(env.REDIS_URL || 'redis://127.0.0.1:6379');
} catch {
  url = new URL('redis://127.0.0.1:6379');
}

export const connectionOptions: any = {
  host: url.hostname || '127.0.0.1',
  port: parseInt(url.port || '6379'),
  username: url.username || undefined,
  password: url.password || undefined,
  maxRetriesPerRequest: null,
};

if (url.protocol === 'rediss:') {
  connectionOptions.tls = {};
}

export const QUEUE_NAME = `${env.APP_NAME.toLowerCase()}-jobs`;

export default connectionOptions;
