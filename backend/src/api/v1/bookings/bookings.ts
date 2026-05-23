/**
 * ============================================================================
 * BOOKINGS CONTROLLER
 * ============================================================================
 *
 * Handles booking creation and retrieval.
 * The booking algorithm lives in the Service layer, not here.
 */

import { Request, Response } from "express";
import { errorHandler, successHandler } from "../../../utils/responseHandler.js";
import { createBooking } from "../../../services/booking.service.js";

/**
 * @swagger
 * /api/v1/bookings:
 *   post:
 *     summary: Book rooms with optimal travel time
 *     tags: [Bookings]
 *     description: |
 *       Books the requested number of rooms using the intelligent allocation algorithm.
 *
 *       **Algorithm:**
 *       1. **Same Floor First**: Scans all floors for available rooms.
 *          If a floor has enough rooms, finds the combination with minimum
 *          total horizontal travel time.
 *       2. **Multi-Floor Fallback**: If no single floor works, brute-forces
 *          all valid combinations across floors, scoring each by:
 *          - Sum of pairwise distances (horizontal + vertical)
 *          - Fewer floors preferred
 *          - Lower floor numbers preferred
 *          - Rooms closer to lift preferred
 *       3. **Travel Time Formula:**
 *          ```
 *          distance(roomA, roomB) = |positionA - positionB| + 2 * |floorA - floorB|
 *          totalTravelTime = sum of all pairwise distances
 *          ```
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [roomCount]
 *             properties:
 *               roomCount:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Number of rooms to book (1-5)
 *                 example: 3
 *     responses:
 *       200:
 *         description: Booking created successfully
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
 *                     booking:
 *                       type: object
 *                       properties:
 *                         id: { type: string }
 *                         roomIds: { type: array, items: { type: string } }
 *                         rooms:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id: { type: string }
 *                               number: { type: number }
 *                               floor: { type: number }
 *                               position: { type: number }
 *                               status: { type: string }
 *                         totalTravelTime: { type: number }
 *                         floorsInvolved: { type: number }
 *                         createdAt: { type: string, format: date-time }
 *       400:
 *         description: Invalid request or not enough rooms
 *       500:
 *         description: Server error
 */
export const createBookingHandler = async (req: Request, res: Response) => {
  try {
    const { roomCount } = req.body as { roomCount: number };

    const booking = createBooking(roomCount);

    if (!booking) {
      return errorHandler({
        res,
        statusCode: 400,
        msgId: "M0600",
        data: { reason: "Not enough rooms available or invalid room count (1-5)" },
      });
    }

    return successHandler({
      res,
      msgId: "M2000",
      data: { booking },
    });
  } catch (err) {
    return errorHandler({
      res,
      statusCode: 500,
      msgId: "M0500",
      data: (err as Error).message,
    });
  }
};

/**
 * @swagger
 * /api/v1/bookings/algorithm-info:
 *   get:
 *     summary: Get algorithm documentation
 *     tags: [Bookings]
 *     description: Returns a detailed explanation of the booking optimization algorithm.
 *     responses:
 *       200:
 *         description: Algorithm info retrieved
 */
export const getAlgorithmInfoHandler = async (_req: Request, res: Response) => {
  try {
    const info = {
      name: "Travel-Time Minimization Algorithm",
      version: "1.0.0",
      phases: [
        {
          name: "Phase 1: Same-Floor Booking",
          description:
            "For each floor with enough available rooms, generate all combinations of the requested size. Score each combination by total pairwise travel time. Pick the best.",
        },
        {
          name: "Phase 2: Multi-Floor Booking",
          description:
            "If no single floor works, search across all floors using brute-force combination generation. Score candidates with a weighted composite: travelTime * 10000 + floors * 1000 + minFloor * 10 + minRoomNumber.",
        },
      ],
      travelTimeFormula: {
        horizontal: "1 minute per room position difference",
        vertical: "2 minutes per floor difference",
        pairwise: "distance(A,B) = |posA - posB| + 2 * |floorA - floorB|",
        total: "sum of all pairwise distances for the selected set",
      },
      tieBreaking: [
        "1. Lower total travel time",
        "2. Fewer floors involved",
        "3. Lower floor numbers",
        "4. Lower room numbers (closer to lift)",
      ],
      complexity: {
        sameFloor: "O(F * C(R, K)) where F=floors, R=rooms per floor, K=requested",
        multiFloor: "O(C(N, K)) where N=available rooms (capped at 40 for performance)",
        note: "Max request is 5 rooms, so worst case C(97,5) = 64M combinations. Same-floor usually succeeds, making this fast in practice.",
      },
    };

    return successHandler({
      res,
      msgId: "M2001",
      data: info,
    });
  } catch (err) {
    return errorHandler({
      res,
      statusCode: 500,
      msgId: "M0500",
      data: (err as Error).message,
    });
  }
};
