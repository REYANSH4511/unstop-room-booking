/**
 * ============================================================================
 * BOOKINGS VALIDATOR
 * ============================================================================
 *
 * Joi validation for booking endpoints.
 */

import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { errorHandler } from "../../../utils/responseHandler.js";

const Validators = {
  createBookingVal: {
    body: Joi.object({
      roomCount: Joi.number().integer().min(1).max(5).required().messages({
        "number.base": "roomCount must be a number",
        "number.integer": "roomCount must be an integer",
        "number.min": "roomCount must be at least 1",
        "number.max": "roomCount must be at most 5",
        "any.required": "roomCount is required",
      }),
    }),
  },
};

export function Validator(func: keyof typeof Validators) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const schemaSet = Validators[func];
      const errorAccumulator: Record<string, string> = {};

      if (schemaSet?.body) {
        try {
          const validatedBody = await schemaSet.body.validateAsync(req.body || {}, {
            abortEarly: false,
          });
          req.body = validatedBody;
        } catch (err) {
          (err as Joi.ValidationError).details.forEach((d) => {
            errorAccumulator[d.context?.key || "body"] = d.message;
          });
        }
      }

      if (Object.keys(errorAccumulator).length) {
        return errorHandler({ res, statusCode: 400, msgId: "M0400", data: errorAccumulator });
      }

      return next();
    } catch (err) {
      return errorHandler({
        res,
        statusCode: 500,
        msgId: "M0500",
        data: { general: "Validation middleware failure" },
      });
    }
  };
}
