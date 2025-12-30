import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";
import { routes } from "./routes/index.js";

export function buildApp() {
  const app = express();
  app.set("trust proxy", 1);

  app.use(helmet());
  app.use(
    cors({
      origin: config.corsOrigin,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "x-admin-token"],
    })
  );
  app.use(morgan("dev"));
  app.use(compression());
  app.use(express.json({ limit: "1mb" }));

  app.use(routes);
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
