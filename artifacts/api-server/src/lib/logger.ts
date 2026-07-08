import pino from "pino";

const isProduction = process.env.NODE_ENV === "production";

// Serverless runtimes (Netlify / AWS Lambda) cannot resolve the pino-pretty
// transport worker, and it would crash the function at boot. Only use
// pretty-printing for genuine local development.
const isServerless = Boolean(
  process.env.NETLIFY ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.LAMBDA_TASK_ROOT,
);
const usePretty = !isProduction && !isServerless;

export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  redact: [
    "req.headers.authorization",
    "req.headers.cookie",
    "res.headers['set-cookie']",
  ],
  ...(usePretty
    ? {
        transport: {
          target: "pino-pretty",
          options: { colorize: true },
        },
      }
    : {}),
});
