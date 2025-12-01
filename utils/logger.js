/* Pino = Node.js backend için en hızlı, en modern, en production-uyumlu logger. 
    ✔ Prod’da JSON
    ✔ Dev’de renkli log
*/
const pino = require("pino");

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport:
    process.env.NODE_ENV !== "production"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "yyyy-mm-dd HH:MM:ss",
            ignore: "pid,hostname",
          },
        }
      : undefined,
});

module.exports = logger;
