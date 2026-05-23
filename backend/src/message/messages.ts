/**
 * ============================================================================
 * CENTRALIZED MESSAGE CODES
 * ============================================================================
 *
 * All API response messages are defined here with unique codes.
 *
 * Benefits:
 * - Consistent messaging across the entire API
 * - Easy localization (future)
 * - Frontend can map codes to custom messages
 * - Debugging: codes help trace which path generated the response
 *
 * Code Prefix Convention:
 *   M0xxx = Auth / User operations
 *   M1xxx = Room operations
 *   M2xxx = Booking operations
 *   M3xxx = Admin / System operations
 *   M4xxx = Validation errors
 *   M5xxx = Server errors
 */

export const messages: Record<string, string> = {
  // Success — Rooms
  M1000: "All rooms retrieved successfully",
  M1001: "Room status updated successfully",
  M1002: "Random occupancy generated successfully",
  M1003: "All rooms reset successfully",
  M1004: "Room statistics retrieved",

  // Success — Bookings
  M2000: "Rooms booked successfully",
  M2001: "Booking retrieved successfully",
  M2002: "Booking cancelled successfully",
  M2003: "All bookings retrieved",

  // Validation Errors
  M0400: "The request body is missing or invalid",
  M0401: "The query parameters are missing or invalid",
  M0402: "The URL parameters are missing or invalid",
  M0403: "The payload or query or params is missing or invalid",
  M0404: "Invalid room count. Must be between 1 and 5",
  M0405: "Invalid occupancy percentage. Must be between 0 and 100",

  // Client Errors
  M0501: "Bad Request",
  M0502: "Not Found",
  M0503: "Unauthorized",
  M0504: "Forbidden",
  M0505: "Token is missing or invalid",

  // Business Logic Errors
  M0600: "Not enough rooms available",
  M0601: "No valid room combination found",
  M0602: "Booking not found",

  // Server Errors
  M0500: "Internal Server Error",
  M0506: "Service temporarily unavailable",
};
