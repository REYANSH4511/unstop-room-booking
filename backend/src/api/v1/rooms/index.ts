/**
 * ============================================================================
 * ROOMS ROUTES
 * ============================================================================
 *
 * Defines all room-related HTTP routes.
 * Routes are thin: they wire middleware (validator, auth) to controllers.
 */

import { Router } from "express";
import {
  getAllRoomsHandler,
  randomOccupyHandler,
  resetRoomsHandler,
  getRoomStatsHandler,
} from "./rooms.js";
import { Validator } from "./validator.js";

const router = Router();

router.get("/", getAllRoomsHandler);
router.get("/stats", getRoomStatsHandler);
router.post("/random-occupy", Validator("randomOccupyVal"), randomOccupyHandler);
router.post("/reset", resetRoomsHandler);

export default router;
