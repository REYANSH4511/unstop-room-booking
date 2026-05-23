/**
 * ============================================================================
 * ROOMS CONTROLLER
 * ============================================================================
 *
 * Handles all room-related HTTP requests.
 * Controllers are THIN: they delegate business logic to Services.
 *
 * Pattern from car-pool-app:
 * - Each handler is an async function
 * - Inline JSDoc @swagger annotations auto-generate API docs
 * - Use successHandler / errorHandler for consistent responses
 */

import { Request, Response } from "express";
import { errorHandler, successHandler } from "../../../utils/responseHandler.js";
import {
  getAllRooms,
  randomOccupyRooms,
  resetAllRooms,
} from "../../../services/booking.service.js";

/**
 * @swagger
 * /api/v1/rooms:
 *   get:
 *     summary: Get all rooms with current status
 *     tags: [Rooms]
 *     description: Returns all 97 rooms with their floor, number, position, and status.
 *     responses:
 *       200:
 *         description: Rooms retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode: { type: number, example: 200 }
 *                 status: { type: string, example: "success" }
 *                 message: { type: string }
 *                 data:
 *                   type: object
 *                   properties:
 *                     rooms: { type: array }
 *                     stats:
 *                       type: object
 *                       properties:
 *                         total: { type: number, example: 97 }
 *                         available: { type: number }
 *                         occupied: { type: number }
 *                         booked: { type: number }
 */
export const getAllRoomsHandler = async (_req: Request, res: Response) => {
  try {
    const rooms = getAllRooms();
    const available = rooms.filter((r) => r.status === "available").length;
    const occupied = rooms.filter((r) => r.status === "occupied").length;
    const booked = rooms.filter((r) => r.status === "booked").length;

    return successHandler({
      res,
      msgId: "M1000",
      data: {
        rooms,
        stats: { total: rooms.length, available, occupied, booked },
      },
    });
  } catch (err) {
    return errorHandler({ res, statusCode: 500, msgId: "M0500", data: (err as Error).message });
  }
};

/**
 * @swagger
 * /api/v1/rooms/random-occupy:
 *   post:
 *     summary: Randomly occupy rooms
 *     tags: [Rooms]
 *     description: Resets all rooms, then randomly marks a percentage as occupied.
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               percentage:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 default: 30
 *                 description: Percentage of rooms to occupy (0-100)
 *     responses:
 *       200:
 *         description: Rooms randomly occupied
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode: { type: number }
 *                 status: { type: string }
 *                 message: { type: string }
 *                 data:
 *                   type: object
 *                   properties:
 *                     rooms: { type: array }
 *                     occupiedCount: { type: number }
 */
export const randomOccupyHandler = async (req: Request, res: Response) => {
  try {
    const percentage = Number(req.body?.percentage ?? 30);
    const rooms = randomOccupyRooms(percentage);
    const occupiedCount = rooms.filter((r) => r.status === "occupied").length;

    return successHandler({
      res,
      msgId: "M1002",
      data: { rooms, occupiedCount },
    });
  } catch (err) {
    return errorHandler({ res, statusCode: 500, msgId: "M0500", data: (err as Error).message });
  }
};

/**
 * @swagger
 * /api/v1/rooms/reset:
 *   post:
 *     summary: Reset all rooms
 *     tags: [Rooms]
 *     description: Clears all occupied and booked statuses. Restores initial state.
 *     responses:
 *       200:
 *         description: All rooms reset to available
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode: { type: number }
 *                 status: { type: string }
 *                 message: { type: string }
 *                 data:
 *                   type: object
 *                   properties:
 *                     rooms: { type: array }
 */
export const resetRoomsHandler = async (_req: Request, res: Response) => {
  try {
    const rooms = resetAllRooms();
    return successHandler({
      res,
      msgId: "M1003",
      data: { rooms },
    });
  } catch (err) {
    return errorHandler({ res, statusCode: 500, msgId: "M0500", data: (err as Error).message });
  }
};

/**
 * @swagger
 * /api/v1/rooms/stats:
 *   get:
 *     summary: Get room statistics
 *     tags: [Rooms]
 *     description: Quick stats on room availability.
 *     responses:
 *       200:
 *         description: Statistics retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode: { type: number }
 *                 status: { type: string }
 *                 message: { type: string }
 *                 data:
 *                   type: object
 *                   properties:
 *                     total: { type: number, example: 97 }
 *                     available: { type: number }
 *                     occupied: { type: number }
 *                     booked: { type: number }
 */
export const getRoomStatsHandler = async (_req: Request, res: Response) => {
  try {
    const rooms = getAllRooms();
    const available = rooms.filter((r) => r.status === "available").length;
    const occupied = rooms.filter((r) => r.status === "occupied").length;
    const booked = rooms.filter((r) => r.status === "booked").length;

    return successHandler({
      res,
      msgId: "M1004",
      data: { total: rooms.length, available, occupied, booked },
    });
  } catch (err) {
    return errorHandler({ res, statusCode: 500, msgId: "M0500", data: (err as Error).message });
  }
};
