/**
 * ============================================================================
 * DATABASE MODULE
 * ============================================================================
 *
 * In the car-pool-app, this connects to MongoDB.
 *
 * For the Hotel Reservation demo, we use an in-memory store via RoomRepository.
 * This module initializes the repository on startup.
 *
 * Architecture Note:
 * - Keeping this module preserves the structure from car-pool-app.
 * - If you ever want to swap in MongoDB/PostgreSQL, replace this file.
 * - The rest of the app doesn't change.
 */

import roomRepository from "../repositories/room.repository.js";
import logger from "../logger/index.js";

export const connectToDatabase = async (): Promise<void> => {
  try {
    roomRepository.initialize();
    logger.info("In-memory room store initialized with 97 rooms");
  } catch (err) {
    logger.error("Failed to initialize room store:", err);
    throw err;
  }
};
