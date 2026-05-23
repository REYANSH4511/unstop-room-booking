/**
 * ============================================================================
 * BOOKING ALGORITHM TEST SUITE
 * ============================================================================
 *
 * Comprehensive unit tests for the core booking algorithm.
 *
 * Interviewers evaluate:
 * - Edge case handling
 * - Correctness of the optimization logic
 * - Test coverage for the algorithm
 */

import { RoomStatus } from "../src/types/index.js";
import roomRepository from "../src/repositories/room.repository.js";
import {
  createBooking,
  resetAllRooms,
  randomOccupyRooms,
} from "../src/services/booking.service.js";

// Initialize repository before tests
beforeAll(() => {
  roomRepository.initialize();
});

beforeEach(() => {
  resetAllRooms();
});

// ============================================================================
// PHASE 1: Same-Floor Booking Tests
// ============================================================================

describe("Phase 1: Same-Floor Booking", () => {
  test("should book 3 rooms on the same floor when available", () => {
    const booking = createBooking(3);

    expect(booking).not.toBeNull();
    expect(booking!.rooms).toHaveLength(3);
    expect(booking!.floorsInvolved).toBe(1);

    // All rooms should be on the same floor
    const floors = new Set(booking!.rooms.map((r) => r.floor));
    expect(floors.size).toBe(1);
  });

  test("should prefer contiguous rooms over spread-out rooms on same floor", () => {
    // Occupy rooms to force a specific pattern
    const all = roomRepository.getAll();
    // Make floor 1 have rooms: [1, 2, 5, 6, 10] available
    // (occupy 3, 4, 7, 8, 9)
    const floor1 = all.filter((r) => r.floor === 1);
    for (const r of floor1) {
      if ([103, 104, 107, 108, 109].includes(r.number)) {
        roomRepository.updateStatus(r.id, RoomStatus.OCCUPIED);
      }
    }
    // Also occupy all rooms on other floors so floor 1 is the only option
    for (const r of all) {
      if (r.floor !== 1) {
        roomRepository.updateStatus(r.id, RoomStatus.OCCUPIED);
      }
    }

    const booking = createBooking(3);

    expect(booking).not.toBeNull();
    expect(booking!.rooms).toHaveLength(3);

    // The algorithm should pick [101, 102, 105] over [105, 106, 110]
    // because [101, 102, 105] has lower total pairwise distance
    const bookedNumbers = booking!.rooms.map((r) => r.number).sort((a, b) => a - b);
    expect(bookedNumbers).toEqual([101, 102, 105]);
  });

  test("should book 5 rooms (max) on the same floor", () => {
    const booking = createBooking(5);

    expect(booking).not.toBeNull();
    expect(booking!.rooms).toHaveLength(5);
    expect(booking!.floorsInvolved).toBe(1);
  });

  test("should book 1 room closest to the lift", () => {
    const booking = createBooking(1);

    expect(booking).not.toBeNull();
    expect(booking!.rooms).toHaveLength(1);
    expect(booking!.rooms[0].position).toBe(1); // closest to lift
  });
});

// ============================================================================
// PHASE 2: Multi-Floor Booking Tests
// ============================================================================

describe("Phase 2: Multi-Floor Booking", () => {
  test("should book across floors when no single floor has enough rooms", () => {
    // Leave only 1 room available per floor
    const all = roomRepository.getAll();
    for (const room of all) {
      if (room.position !== 1) {
        roomRepository.updateStatus(room.id, RoomStatus.OCCUPIED);
      }
    }

    const booking = createBooking(3);

    expect(booking).not.toBeNull();
    expect(booking!.rooms).toHaveLength(3);
    expect(booking!.floorsInvolved).toBeGreaterThan(1);
  });

  test("should minimize vertical travel in multi-floor bookings", () => {
    // Make floor 1 have only 1 room (101)
    // Make floor 2 have only 1 room (201)
    // Occupy all other floors to force multi-floor selection
    const all = roomRepository.getAll();
    for (const room of all) {
      if (room.floor === 1 && room.position !== 1) {
        roomRepository.updateStatus(room.id, RoomStatus.OCCUPIED);
      }
      if (room.floor === 2 && room.position !== 1) {
        roomRepository.updateStatus(room.id, RoomStatus.OCCUPIED);
      }
      if (room.floor >= 3) {
        roomRepository.updateStatus(room.id, RoomStatus.OCCUPIED);
      }
    }

    // Request 2 rooms - should pick 101 and 201 (adjacent floors, same position)
    const booking = createBooking(2);

    expect(booking).not.toBeNull();
    expect(booking!.rooms).toHaveLength(2);

    const numbers = booking!.rooms.map((r) => r.number).sort((a, b) => a - b);
    expect(numbers).toEqual([101, 201]);
  });
});

// ============================================================================
// Edge Cases
// ============================================================================

describe("Edge Cases", () => {
  test("should return null when requesting 0 rooms", () => {
    const booking = createBooking(0);
    expect(booking).toBeNull();
  });

  test("should return null when requesting more than 5 rooms", () => {
    const booking = createBooking(6);
    expect(booking).toBeNull();
  });

  test("should return null when not enough rooms available", () => {
    // Occupy all but 2 rooms
    const available = roomRepository.getAvailable();
    for (let i = 2; i < available.length; i++) {
      roomRepository.updateStatus(available[i].id, RoomStatus.OCCUPIED);
    }

    const booking = createBooking(3);
    expect(booking).toBeNull();
  });

  test("should handle booking when exactly enough rooms exist", () => {
    const available = roomRepository.getAvailable();
    // Leave exactly 3 rooms available
    for (let i = 3; i < available.length; i++) {
      roomRepository.updateStatus(available[i].id, RoomStatus.OCCUPIED);
    }

    const booking = createBooking(3);
    expect(booking).not.toBeNull();
    expect(booking!.rooms).toHaveLength(3);
  });

  test("should mark booked rooms as booked status", () => {
    createBooking(2);
    const booked = roomRepository.getByStatus(RoomStatus.BOOKED);
    expect(booked).toHaveLength(2);
  });

  test("reset should restore all rooms to available", () => {
    createBooking(3);
    randomOccupyRooms(50);

    const before = roomRepository.getAvailable().length;
    expect(before).toBeLessThan(97);

    resetAllRooms();

    const after = roomRepository.getAvailable().length;
    expect(after).toBe(97);
  });

  test("randomOccupy should occupy approximately the requested percentage", () => {
    randomOccupyRooms(30);
    const occupied = roomRepository.getByStatus(RoomStatus.OCCUPIED);
    // 30% of 97 ≈ 29 rooms
    expect(occupied.length).toBeGreaterThanOrEqual(25);
    expect(occupied.length).toBeLessThanOrEqual(35);
  });

  test("randomOccupy should reset existing bookings before occupying", () => {
    createBooking(3);
    randomOccupyRooms(30);

    const booked = roomRepository.getByStatus(RoomStatus.BOOKED);
    expect(booked).toHaveLength(0);
  });
});

// ============================================================================
// Travel Time Calculation Tests
// ============================================================================

describe("Travel Time Calculation", () => {
  test("same-floor booking should have 0 vertical component", () => {
    const booking = createBooking(4);
    expect(booking).not.toBeNull();
    expect(booking!.floorsInvolved).toBe(1);
  });

  test("booking should return positive totalTravelTime", () => {
    const booking = createBooking(2);
    expect(booking).not.toBeNull();
    expect(booking!.totalTravelTime).toBeGreaterThan(0);
  });

  test("closer rooms should have lower travel time", () => {
    resetAllRooms();

    // Book 2 contiguous rooms
    const booking1 = createBooking(2);
    const time1 = booking1!.totalTravelTime;

    resetAllRooms();

    // Make contiguous rooms unavailable, forcing spread
    const all = roomRepository.getAll();
    const floor1 = all.filter((r) => r.floor === 1);
    for (const r of floor1) {
      if (r.position >= 2 && r.position <= 9) {
        roomRepository.updateStatus(r.id, RoomStatus.OCCUPIED);
      }
    }

    const booking2 = createBooking(2);
    const time2 = booking2!.totalTravelTime;

    // time1 (contiguous) should be <= time2 (spread)
    expect(time1).toBeLessThanOrEqual(time2);
  });
});
