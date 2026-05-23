/**
 * ============================================================================
 * API SERVICE LAYER
 * ============================================================================
 *
 * All HTTP requests to the backend are centralized here.
 * This makes the frontend maintainable and testable.
 */

import type { IApiResponse, IAllRoomsResponse, IRoomStats, IBookingResponse, IRoom } from "../types";

const API_BASE = import.meta.env.VITE_API_URL || "/api/v1";

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const json = (await res.json()) as IApiResponse<T>;
  if (json.status === "error") {
    throw new Error(json.message || "API error");
  }
  return json.data as T;
}

export const api = {
  /** Get all rooms with stats */
  getRooms: () => fetchJson<IAllRoomsResponse>("/rooms"),

  /** Get room stats only */
  getStats: () => fetchJson<IRoomStats>("/rooms/stats"),

  /** Randomly occupy rooms */
  randomOccupy: (percentage?: number) =>
    fetchJson<{ rooms: IRoom[]; occupiedCount: number }>("/rooms/random-occupy", {
      method: "POST",
      body: JSON.stringify({ percentage: percentage ?? 30 }),
    }),

  /** Reset all rooms */
  reset: () =>
    fetchJson<{ rooms: IRoom[] }>("/rooms/reset", {
      method: "POST",
    }),

  /** Book rooms */
  bookRooms: (roomCount: number) =>
    fetchJson<IBookingResponse>("/bookings", {
      method: "POST",
      body: JSON.stringify({ roomCount }),
    }),
};
