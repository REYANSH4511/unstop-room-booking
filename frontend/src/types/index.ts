/**
 * ============================================================================
 * FRONTEND TYPE DEFINITIONS
 * ============================================================================
 *
 * Shared types for the React frontend.
 * Kept in sync with the backend API contract.
 */

export type RoomStatus = "available" | "occupied" | "booked";

export interface IRoom {
  id: string;
  number: number;
  floor: number;
  position: number;
  status: RoomStatus;
}

export interface IRoomStats {
  total: number;
  available: number;
  occupied: number;
  booked: number;
}

export interface IBooking {
  id: string;
  roomIds: string[];
  rooms: IRoom[];
  totalTravelTime: number;
  floorsInvolved: number;
  createdAt: string;
}

export interface IApiResponse<T = unknown> {
  statusCode: number;
  status: "success" | "error";
  message: string;
  data: T | null;
}

export interface IAllRoomsResponse {
  rooms: IRoom[];
  stats: IRoomStats;
}

export interface IBookingResponse {
  booking: IBooking;
}
