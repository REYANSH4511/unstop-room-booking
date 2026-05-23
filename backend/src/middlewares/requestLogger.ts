/**
 * ============================================================================
 * REQUEST LOGGER MIDDLEWARE
 * ============================================================================
 *
 * Logs incoming requests with timing info for debugging and monitoring.
 */

import { Request, Response, NextFunction } from "express";
import logger from "../logger/index.js";

export const requestLogger = (req: Request, _res: Response, next: NextFunction): void => {
  const start = Date.now();
  logger.info(`${req.method} ${req.originalUrl} - ${req.ip}`);

  _res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.originalUrl} ${_res.statusCode} - ${duration}ms`);
  });

  next();
};
