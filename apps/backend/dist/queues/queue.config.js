"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QUEUE_NAME = exports.connectionOptions = void 0;
const env_js_1 = __importDefault(require("../config/env.js"));
let url;
try {
    url = new URL(env_js_1.default.REDIS_URL || 'redis://127.0.0.1:6379');
}
catch {
    url = new URL('redis://127.0.0.1:6379');
}
exports.connectionOptions = {
    host: url.hostname || '127.0.0.1',
    port: parseInt(url.port || '6379'),
    username: url.username || undefined,
    password: url.password || undefined,
    maxRetriesPerRequest: null,
};
if (url.protocol === 'rediss:') {
    exports.connectionOptions.tls = {};
}
exports.QUEUE_NAME = `${env_js_1.default.APP_NAME.toLowerCase()}-jobs`;
exports.default = exports.connectionOptions;
