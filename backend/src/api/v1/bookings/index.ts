/**
 * ============================================================================
 * BOOKINGS ROUTES
 * ============================================================================
 */

import { Router } from "express";
import { createBookingHandler, getAlgorithmInfoHandler } from "./bookings.js";
import { Validator } from "./validator.js";

const router = Router();

router.post("/", Validator("createBookingVal"), createBookingHandler);
router.get("/algorithm-info", getAlgorithmInfoHandler);

export default router;
