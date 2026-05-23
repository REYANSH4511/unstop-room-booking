/**
 * ============================================================================
 * HOTEL RESERVATION SYSTEM - TYPE DEFINITIONS
 * ============================================================================
 *
 * Core types and enums used across the entire backend.
 * Centralized here for maintainability and type safety.
 */

/** Room status lifecycle */
export enum RoomStatus {
  AVAILABLE = "available",
  OCCUPIED = "occupied",
  BOOKED = "booked",
}

/** Single room entity */
export interface IRoom {
  id: string;
  number: number;
  floor: number;
  position: number;
  status: RoomStatus;
}

/** Booking result returned by the algorithm */
export interface IBooking {
  id: string;
  roomIds: string[];
  rooms: IRoom[];
  totalTravelTime: number;
  floorsInvolved: number;
  createdAt: string;
}

/** API Standard Response Structure */
export interface IApiResponse<T = unknown> {
  statusCode: number;
  status: "success" | "error";
  message: string;
  data: T | null;
}

/** Swagger JSDoc type augmentation */
declare global {
  namespace Express {
    interface Request {
      validatedBody?: Record<string, unknown>;
      validatedParams?: Record<string, unknown>;
      validatedQuery?: Record<string, unknown>;
    }
  }
}
