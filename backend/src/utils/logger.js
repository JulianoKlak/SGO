'use strict';

const timestamp = () => new Date().toISOString();

const logger = {
  /** @param {...*} args */
  info: (...args) => console.log(`[${timestamp()}] [INFO]`, ...args),
  /** @param {...*} args */
  warn: (...args) => console.warn(`[${timestamp()}] [WARN]`, ...args),
  /** @param {...*} args */
  error: (...args) => console.error(`[${timestamp()}] [ERROR]`, ...args),
};

module.exports = logger;
