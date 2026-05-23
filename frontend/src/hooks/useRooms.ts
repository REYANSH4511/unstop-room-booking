/**
 * ============================================================================
 * USE ROOMS HOOK
 * ============================================================================
 *
 * Central state management for rooms data.
 * Uses React hooks for data fetching, caching, and mutations.
 */

import { useState, useEffect, useCallback } from "react";
import { api } from "../services/api";
import type { IRoom, IRoomStats, IBooking } from "../types";

interface UseRoomsReturn {
  rooms: IRoom[];
  stats: IRoomStats | null;
  loading: boolean;
  error: string | null;
  lastBooking: IBooking | null;
  fetchRooms: () => Promise<void>;
  handleRandomOccupy: () => Promise<void>;
  handleReset: () => Promise<void>;
  handleBook: (count: number) => Promise<void>;
}

export function useRooms(): UseRoomsReturn {
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [stats, setStats] = useState<IRoomStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastBooking, setLastBooking] = useState<IBooking | null>(null);

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getRooms();
      setRooms(data.rooms);
      setStats(data.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRandomOccupy = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await api.randomOccupy();
      await fetchRooms();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to occupy rooms");
    } finally {
      setLoading(false);
    }
  }, [fetchRooms]);

  const handleReset = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await api.reset();
      setLastBooking(null);
      await fetchRooms();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset rooms");
    } finally {
      setLoading(false);
    }
  }, [fetchRooms]);

  const handleBook = useCallback(
    async (count: number) => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.bookRooms(count);
        setLastBooking(data.booking);
        await fetchRooms();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to book rooms");
      } finally {
        setLoading(false);
      }
    },
    [fetchRooms]
  );

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  return {
    rooms,
    stats,
    loading,
    error,
    lastBooking,
    fetchRooms,
    handleRandomOccupy,
    handleReset,
    handleBook,
  };
}
