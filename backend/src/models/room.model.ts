/**
 * ============================================================================
 * ROOM MODEL
 * ============================================================================
 *
 * The Room entity represents a single hotel room.
 * We use an in-memory store (RoomRepository) for this demo,
 * but the model defines the shape and initial data generation.
 *
 * Architecture Note:
 * - This is NOT a Mongoose model (no DB needed for this demo).
 * - The Repository layer handles persistence.
 * - This keeps the system lightweight while remaining DB-ready.
 */

import { randomUUID } from "crypto";
import type { IRoom } from "../types/index.js";
import { RoomStatus } from "../types/index.js";
import constants from "../config/constants.js";

/**
 * Generate all 97 rooms for the hotel.
 *
 * Floors 1-9: 10 rooms each (101-110, 201-210, ... 901-910)
 * Floor 10: 7 rooms (1001-1007)
 */
export function generateRooms(): IRoom[] {
  const rooms: IRoom[] = [];

  for (let floor = 1; floor <= constants.hotel.totalFloors; floor++) {
    const roomsOnFloor = constants.hotel.roomsPerFloor[floor - 1];
    for (let i = 1; i <= roomsOnFloor; i++) {
      const roomNumber = floor * 100 + i;
      rooms.push({
        id: randomUUID(),
        number: roomNumber,
        floor,
        position: i, // distance from lift: 1 = closest, 10/7 = farthest
        status: RoomStatus.AVAILABLE,
      });
    }
  }

  return rooms;
}

export { IRoom, RoomStatus };
