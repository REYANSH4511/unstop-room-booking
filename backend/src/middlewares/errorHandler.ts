import type { Request, Response, NextFunction } from "express";
import { errorHandler } from "../utils/responseHandler.js";
import logger from "../logger/index.js";
import constants from "../config/constants.js";

/**
 * ============================================================================
 * GLOBAL ERROR HANDLER
 * ============================================================================
 *
 * Catches all unhandled errors and returns a standardized response.
 * This is the LAST middleware in the Express pipeline.
 *
 * It prevents server crashes and ensures clients always receive JSON,
 * never raw stack traces (security + UX).
 */

export const globalErrorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error(`Unhandled error: ${err?.stack || err?.message || err}`);

  errorHandler({
    res,
    statusCode: 500,
    msgId: "M0500",
    data: constants.nodeEnv === "development" ? err?.stack || err?.message : undefined,
  });
};
