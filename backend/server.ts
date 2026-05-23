import express from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import morgan from "morgan";
import http from "http";
import { config } from "dotenv";
import { serve, setup } from "swagger-ui-express";
import constants from "./src/config/constants.js";
import { connectToDatabase } from "./src/database/index.js";
import logger from "./src/logger/index.js";
import { globalErrorHandler } from "./src/middlewares/errorHandler.js";
import { getHomePage } from "./src/views/home.js";
import apiRouter from "./src/api/index.js";
import swaggerSpec from "./src/docs/index.js";

config();

const app = express();

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security & performance
app.use(cors({ origin: constants.frontendURL, credentials: true }));
app.use(helmet());
app.use(compression());
app.use(morgan("combined", { stream: { write: (msg: string) => logger.info(msg.trim()) } }));

// Swagger API docs
app.use("/api-docs", serve, setup(swaggerSpec));

// Health check
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "success",
    data: { healthy: true, serverTime: Date.now() },
  });
});

// Home page
app.get("/", (_req, res) => {
  const nodeEnv = constants.nodeEnv || "unknown";
  const nodeVersion = process.version;
  const startedAtStr = new Date(constants._startedAt).toLocaleString();
  const uptime = `${Math.floor(process.uptime())}s`;
  res.send(getHomePage({ nodeEnv, nodeVersion, startedAtStr, uptime }));
});

// API routes
app.use("/api", apiRouter);

// Global error handler (must be last)
app.use(globalErrorHandler);

const PORT = constants.port || 8080;

// Start server
connectToDatabase()
  .then(() => {
    logger.info("Database (in-memory store) initialized");
    const server = http.createServer(app);
    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Environment: ${constants.nodeEnv}`);
      logger.info(`Swagger Docs: ${constants.appURL}/api-docs`);
      logger.info(`Health Check: ${constants.appURL}/api/health`);
    });
  })
  .catch((err) => {
    logger.error("Failed to start server:", err);
    process.exit(1);
  });
