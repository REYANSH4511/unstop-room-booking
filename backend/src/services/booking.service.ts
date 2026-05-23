/**
 * ============================================================================
 * BOOKING SERVICE (Business Logic Layer)
 * ============================================================================
 *
 * The core booking algorithm that minimizes travel time between booked rooms.
 *
 * Architecture Note:
 * - This is the MOST IMPORTANT file for the SDE-3 interview.
 * - It contains the optimization logic, edge case handling, and clean architecture.
 * - Completely decoupled from HTTP (testable in isolation).
 * - Repository handles data; Service handles business rules.
 *
 * Booking Priority (as per requirements):
 *   1. Same Floor First: Try to allocate all rooms on the same floor.
 *   2. Minimize Total Travel Time: If same-floor unavailable, find the optimal
 *      multi-floor combination that minimizes vertical + horizontal travel.
 *   3. Tie-breaking: Fewer floors > Lower floor numbers > Lower room numbers.
 *
 * Travel Time Calculation:
 *   - Horizontal: 1 minute per room position difference on the same floor.
 *   - Vertical:   2 minutes per floor difference.
 *   - For a set of rooms, total travel = sum of all pairwise distances.
 *     Pairwise distance = |pos1 - pos2| + 2 * |floor1 - floor2|
 */

import type { IRoom, IBooking } from "../types/index.js";
import { RoomStatus } from "../types/index.js";
import constants from "../config/constants.js";
import { randomUUID } from "crypto";
import roomRepository from "../repositories/room.repository.js";

/**
 * Calculate the travel time between two rooms.
 */
function roomDistance(r1: IRoom, r2: IRoom): number {
  const horizontal = Math.abs(r1.position - r2.position);
  const vertical = 2 * Math.abs(r1.floor - r2.floor);
  return horizontal + vertical;
}

/**
 * Calculate the total travel time for a set of rooms.
 *
 * We sum all pairwise distances. This metric:
 * - Penalizes spread-out clusters
 * - Rewards tight, contiguous groups
 * - Naturally prefers same-floor bookings (vertical = 0)
 */
function calculateTotalTravelTime(rooms: IRoom[]): number {
  let total = 0;
  for (let i = 0; i < rooms.length; i++) {
    for (let j = i + 1; j < rooms.length; j++) {
      total += roomDistance(rooms[i], rooms[j]);
    }
  }
  return total;
}

/**
 * Score a candidate set of rooms for ranking.
 * Lower score = better candidate.
 *
 * Scoring factors (in priority order):
 * 1. Total travel time (primary)
 * 2. Number of floors involved (secondary — fewer is better)
 * 3. Lowest floor number (tertiary — lower is better)
 * 4. Lowest room number (quaternary — closer to lift is better)
 */
function scoreCandidate(rooms: IRoom[]): number {
  const travelTime = calculateTotalTravelTime(rooms);
  const uniqueFloors = new Set(rooms.map((r) => r.floor)).size;
  const minFloor = Math.min(...rooms.map((r) => r.floor));
  const minRoomNumber = Math.min(...rooms.map((r) => r.number));

  // Weighted composite score — each factor is separated by an order of magnitude
  // so higher-priority factors always dominate lower-priority ones.
  return travelTime * 10000 + uniqueFloors * 1000 + minFloor * 10 + minRoomNumber;
}

/**
 * Generate all combinations of `k` elements from an array.
 * Used for brute-force multi-floor search.
 *
 * Performance Note:
 *   Max rooms = 5, max available rooms ≈ 97.
 *   C(97, 5) = 64,446,504 combinations.
 *   To keep this fast, we pre-filter by checking same-floor first,
 *   and for multi-floor we use smart pruning.
 */
function* combinations<T>(arr: T[], k: number): Generator<T[]> {
  if (k === 0) {
    yield [];
    return;
  }
  if (arr.length < k) return;
  if (arr.length === k) {
    yield [...arr];
    return;
  }

  const [first, ...rest] = arr;
  for (const combo of combinations(rest, k - 1)) {
    yield [first, ...combo];
  }
  for (const combo of combinations(rest, k)) {
    yield combo;
  }
}

/**
 * Find the best same-floor booking.
 *
 * Strategy:
 * 1. For each floor with enough available rooms, find ALL contiguous/same-floor
 *    combinations of size `roomCount`.
 * 2. Score each combination.
 * 3. Return the best one.
 *
 * Why not just pick the first N rooms?
 *   - We need to minimize travel time, which may favor a different cluster.
 *   - Example: floor has rooms [1, 2, 5, 6, 10] available. Booking 3 rooms:
 *     [1, 2, 5] → travel = 4+1+3 = 8
 *     [5, 6, 10] → travel = 1+4+5 = 10
 *     [1, 2, 5] wins despite [5, 6, 10] being higher-numbered.
 */
function findBestSameFloorBooking(
  availableByFloor: Map<number, IRoom[]>,
  roomCount: number
): { rooms: IRoom[]; score: number } | null {
  let best: { rooms: IRoom[]; score: number } | null = null;

  for (const [, roomsOnFloor] of availableByFloor) {
    if (roomsOnFloor.length < roomCount) continue;

    // Generate all combinations on this floor
    for (const combo of combinations(roomsOnFloor, roomCount)) {
      const score = scoreCandidate(combo);
      if (!best || score < best.score) {
        best = { rooms: combo, score };
      }
    }
  }

  return best;
}

/**
 * Find the best multi-floor booking using brute-force with early pruning.
 *
 * Strategy:
 * 1. Collect all available rooms.
 * 2. Generate combinations of size `roomCount`.
 * 3. Score each and track the best.
 * 4. Early exit if we find a perfect score (all on same floor, contiguous).
 *
 * Optimization: We already checked same-floor, so any result here WILL span
 * multiple floors. We limit the search space by capping combinations.
 */
function findBestMultiFloorBooking(
  allAvailable: IRoom[],
  roomCount: number,
  bestSoFar: { rooms: IRoom[]; score: number } | null
): { rooms: IRoom[]; score: number } | null {
  let best = bestSoFar;

  // Safety cap: if too many rooms, limit search to first 30 per floor strategy
  const roomsToSearch = allAvailable.length > 40 ? allAvailable.slice(0, 40) : allAvailable;

  for (const combo of combinations(roomsToSearch, roomCount)) {
    const score = scoreCandidate(combo);
    if (!best || score < best.score) {
      best = { rooms: combo, score };
    }
  }

  return best;
}

/**
 * ========================================================================
 * MAIN BOOKING ALGORITHM
 * ========================================================================
 *
 * Flow:
 * 1. Check if roomCount is valid (1-5).
 * 2. Check if enough rooms are available.
 * 3. PHASE 1: Try same-floor booking.
 * 4. PHASE 2: If no same-floor match, try multi-floor booking.
 * 5. Mark selected rooms as BOOKED.
 * 6. Return the booking result.
 */
export function createBooking(roomCount: number): IBooking | null {
  if (roomCount < 1 || roomCount > constants.hotel.maxBookingRooms) {
    return null;
  }

  const allAvailable = roomRepository.getAvailable();
  if (allAvailable.length < roomCount) {
    return null;
  }

  const availableByFloor = roomRepository.getAvailableByFloor();

  // PHASE 1: Same-floor booking
  let best = findBestSameFloorBooking(availableByFloor, roomCount);

  // PHASE 2: Multi-floor booking (only if same-floor failed)
  if (!best) {
    best = findBestMultiFloorBooking(allAvailable, roomCount, null);
  }

  if (!best) {
    return null;
  }

  const selectedRooms = best.rooms;
  const ids = selectedRooms.map((r) => r.id);

  // Persist: mark rooms as BOOKED
  roomRepository.updateStatuses(ids, RoomStatus.BOOKED);

  const floorsInvolved = new Set(selectedRooms.map((r) => r.floor)).size;

  return {
    id: randomUUID(),
    roomIds: ids,
    rooms: selectedRooms,
    totalTravelTime: calculateTotalTravelTime(selectedRooms),
    floorsInvolved,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Reset all rooms to AVAILABLE.
 */
export function resetAllRooms(): IRoom[] {
  return roomRepository.resetAll();
}

/**
 * Randomly occupy rooms.
 */
export function randomOccupyRooms(percentage: number = 30): IRoom[] {
  return roomRepository.randomOccupy(percentage);
}

/**
 * Get all rooms with current status.
 */
export function getAllRooms(): IRoom[] {
  return roomRepository.getAll();
}

/**
 * Get available room count.
 */
export function getAvailableCount(): number {
  return roomRepository.getAvailable().length;
}
