/**
 * ============================================================================
 * ROOM REPOSITORY (Data Access Layer)
 * ============================================================================
 *
 * The Repository Pattern abstracts data access from business logic.
 *
 * Why this pattern matters for SDE-3 interviews:
 * - Separation of Concerns: Business logic (Service) doesn't know about storage.
 * - Testability: We can mock the repository in unit tests.
 * - Scalability: Swap in-memory store for MongoDB/PostgreSQL without touching Services.
 * - Single Responsibility: Only this file handles CRUD on Room data.
 *
 * Current Implementation: In-Memory Store (sufficient for demo, DB-ready architecture)
 */

import type { IRoom } from "../types/index.js";
import { RoomStatus } from "../types/index.js";
import { generateRooms } from "../models/room.model.js";

class RoomRepository {
  private rooms: Map<string, IRoom> = new Map();
  private initialized = false;

  /** Initialize the in-memory store with all 97 rooms */
  initialize(): void {
    if (this.initialized) return;
    const rooms = generateRooms();
    for (const room of rooms) {
      this.rooms.set(room.id, room);
    }
    this.initialized = true;
  }

  /** Get all rooms */
  getAll(): IRoom[] {
    return Array.from(this.rooms.values());
  }

  /** Get a room by its unique ID */
  getById(id: string): IRoom | undefined {
    return this.rooms.get(id);
  }

  /** Get rooms filtered by status */
  getByStatus(status: RoomStatus): IRoom[] {
    return this.getAll().filter((r) => r.status === status);
  }

  /** Get available rooms */
  getAvailable(): IRoom[] {
    return this.getByStatus(RoomStatus.AVAILABLE);
  }

  /** Get available rooms grouped by floor (sorted by position for algorithm efficiency) */
  getAvailableByFloor(): Map<number, IRoom[]> {
    const available = this.getAvailable();
    const byFloor = new Map<number, IRoom[]>();
    for (const room of available) {
      if (!byFloor.has(room.floor)) {
        byFloor.set(room.floor, []);
      }
      byFloor.get(room.floor)!.push(room);
    }
    // Sort each floor's rooms by position (closest to lift first)
    for (const [, rooms] of byFloor) {
      rooms.sort((a, b) => a.position - b.position);
    }
    return byFloor;
  }

  /** Update a room's status */
  updateStatus(id: string, status: RoomStatus): IRoom | undefined {
    const room = this.rooms.get(id);
    if (!room) return undefined;
    room.status = status;
    this.rooms.set(id, room);
    return room;
  }

  /** Bulk update room statuses */
  updateStatuses(ids: string[], status: RoomStatus): IRoom[] {
    const updated: IRoom[] = [];
    for (const id of ids) {
      const room = this.updateStatus(id, status);
      if (room) updated.push(room);
    }
    return updated;
  }

  /** Reset all rooms to AVAILABLE */
  resetAll(): IRoom[] {
    for (const room of this.rooms.values()) {
      room.status = RoomStatus.AVAILABLE;
    }
    return this.getAll();
  }

  /** Randomly occupy a percentage of rooms (default 30%) */
  randomOccupy(percentage: number = 30): IRoom[] {
    this.resetAll();
    const all = this.getAll();
    const count = Math.floor((all.length * percentage) / 100);

    // Fisher-Yates shuffle for unbiased random selection
    const shuffled = [...all];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const toOccupy = shuffled.slice(0, count);
    const ids = toOccupy.map((r) => r.id);
    return this.updateStatuses(ids, RoomStatus.OCCUPIED);
  }
}

export default new RoomRepository();
