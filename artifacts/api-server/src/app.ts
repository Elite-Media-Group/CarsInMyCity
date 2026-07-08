import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import path from "path";
import router from "./routes";
import sitemapRouter from "./routes/sitemap";
import { logger } from "./lib/logger";
import { IMAGES_DIR } from "./routes/uploads";
import { errorHandler, notFoundHandler } from "./middlewares/error-handler";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/images", express.static(IMAGES_DIR));
app.use(sitemapRouter);
app.use("/api", router);

// 404 for any unmatched /api route (must come after routers).
app.use("/api", notFoundHandler);

// Centralized error handler (must be last, after all routes/middleware).
app.use(errorHandler);

export default app;
