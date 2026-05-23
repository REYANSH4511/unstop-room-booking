import { useState, useEffect } from "react";
import { Hotel, AlertCircle, Wifi, WifiOff } from "lucide-react";
import { useRooms } from "./hooks/useRooms";
import FloorGrid from "./components/FloorGrid";
import BookingControls from "./components/BookingControls";
import StatsPanel from "./components/StatsPanel";
import Legend from "./components/Legend";

export default function App() {
  const {
    rooms,
    stats,
    loading,
    error,
    lastBooking,
    handleRandomOccupy,
    handleReset,
    handleBook,
  } = useRooms();

  const [apiConnected, setApiConnected] = useState(false);

  // Health check
  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.ok && setApiConnected(true))
      .catch(() => setApiConnected(false));
  }, []);

  const newlyBookedIds = lastBooking?.roomIds ?? [];

  return (
    <div className="min-h-screen bg-slate-950 pb-10">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center">
              <Hotel className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-tight">
                Hotel Reservation
              </h1>
              <p className="text-xs text-slate-400">
                Intelligent room allocation system
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {apiConnected ? (
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                <Wifi className="w-3 h-3" />
                API Connected
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20">
                <WifiOff className="w-3 h-3" />
                API Offline
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Error Banner */}
        {error && (
          <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 flex items-center gap-2 text-sm text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Controls + Stats */}
          <div className="lg:col-span-4 space-y-4">
            <BookingControls
              onBook={handleBook}
              onRandom={handleRandomOccupy}
              onReset={handleReset}
              loading={loading}
              availableCount={stats?.available ?? 0}
            />
            <StatsPanel stats={stats} lastBooking={lastBooking} />
          </div>

          {/* Right: Floor Grid */}
          <div className="lg:col-span-8">
            <div className="rounded-2xl border border-slate-700/50 bg-slate-900/80 p-5 backdrop-blur">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">
                  Floor Plan
                </h2>
                <Legend />
              </div>

              {loading && rooms.length === 0 ? (
                <div className="flex items-center justify-center h-64 text-slate-500">
                  Loading rooms...
                </div>
              ) : (
                <FloorGrid rooms={rooms} newlyBookedIds={newlyBookedIds} />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
