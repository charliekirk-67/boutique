"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const env_js_1 = __importDefault(require("./env.js"));
const environment_js_1 = require("./environment.js");
let redis;
const redisOptions = {
    maxRetriesPerRequest: null,
    keepAlive: 10000,
    connectTimeout: 5000,
    enableReadyCheck: true,
    retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
};
if (environment_js_1.isDevOrTest || !env_js_1.default.REDIS_URL || env_js_1.default.REDIS_URL.includes('localhost') || env_js_1.default.REDIS_URL.includes('127.0.0.1')) {
    try {
        const RedisMock = require('ioredis-mock');
        exports.redis = redis = new RedisMock();
        console.log('[REDIS] Using in-memory Redis mock (no external Redis required).');
    }
    catch (err) {
        exports.redis = redis = new ioredis_1.default(env_js_1.default.REDIS_URL || 'redis://localhost:6379', redisOptions);
    }
}
else {
    exports.redis = redis = new ioredis_1.default(env_js_1.default.REDIS_URL, redisOptions);
}
redis.on('error', (err) => {
    // Silent warning instead of crashing
    console.warn('[REDIS WARNING]: Redis not connected, falling back gracefully:', err.message);
});
exports.default = redis;
