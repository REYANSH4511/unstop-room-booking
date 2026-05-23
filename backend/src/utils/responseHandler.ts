import { Response } from "express";
import { messageData } from "../message/index.js";
import type { IApiResponse } from "../types/index.js";

/**
 * ============================================================================
 * RESPONSE HANDLER UTILITIES
 * ============================================================================
 *
 * Centralized response formatting ensures every API response follows
 * the exact same structure:
 *
 *   {
 *     statusCode: number,
 *     status: "success" | "error",
 *     message: string,
 *     data: any | null
 *   }
 *
 * Benefits:
 * - Consistent API contract for frontend consumption
 * - Easy to add logging, metrics, or transformations here
 * - Eliminates response-formatting bugs in controllers
 */

interface ErrorHandlerArgs {
  res: Response;
  statusCode?: number;
  msgId?: string;
  data?: unknown;
}

interface SuccessHandlerArgs {
  res: Response;
  statusCode?: number;
  msgId: string;
  data?: unknown;
}

/**
 * Send a standardized error response.
 */
export const errorHandler = ({
  res,
  statusCode = 500,
  msgId = "M0500",
  data = null,
}: ErrorHandlerArgs): Response => {
  try {
    const message = messageData(msgId);
    const response: IApiResponse = {
      statusCode,
      status: "error",
      message,
      data,
    };
    return res.status(statusCode).json(response);
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Internal Server Error",
      data,
    });
  }
};

/**
 * Send a standardized success response.
 */
export const successHandler = ({
  res,
  statusCode = 200,
  msgId,
  data = null,
}: SuccessHandlerArgs): Response => {
  try {
    const message = messageData(msgId);
    const response: IApiResponse = {
      statusCode,
      status: "success",
      message,
      data,
    };
    return res.status(statusCode).json(response);
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Internal Server Error",
      data,
    });
  }
};
