/**
 * ============================================================================
 * ROOMS VALIDATOR
 * ============================================================================
 *
 * Joi validation schemas for room-related endpoints.
 * Uses the generic Validator factory pattern from car-pool-app.
 */

import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { errorHandler } from "../../../utils/responseHandler.js";

const Validators = {
  randomOccupyVal: {
    body: Joi.object({
      percentage: Joi.number().min(0).max(100).default(30).messages({
        "number.base": "percentage must be a number",
        "number.min": "percentage must be at least 0",
        "number.max": "percentage must be at most 100",
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
      return errorHandler({ res, statusCode: 500, msgId: "M0500", data: { general: "Validation middleware failure" } });
    }
  };
}
