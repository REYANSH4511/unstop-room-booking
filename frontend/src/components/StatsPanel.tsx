import { Building2, DoorOpen, DoorClosed, CheckCircle2, Clock } from "lucide-react";
import type { IRoomStats, IBooking } from "../types";

interface StatsPanelProps {
  stats: IRoomStats | null;
  lastBooking: IBooking | null;
}

export default function StatsPanel({ stats, lastBooking }: StatsPanelProps) {
  if (!stats) return null;

  const items = [
    { label: "Total", value: stats.total, icon: Building2, color: "text-slate-400" },
    { label: "Available", value: stats.available, icon: DoorOpen, color: "text-emerald-400" },
    { label: "Occupied", value: stats.occupied, icon: DoorClosed, color: "text-red-400" },
    { label: "Booked", value: stats.booked, icon: CheckCircle2, color: "text-blue-400" },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-700/50 bg-slate-900/80 p-5 backdrop-blur">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-teal-400" />
          Room Statistics
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {items.map((item) => (
            <div
              key={item.label}
              className="rounded-xl bg-slate-800/60 border border-slate-700/40 p-3"
            >
              <div className="flex items-center gap-2 mb-1">
                <item.icon className={`w-4 h-4 ${item.color}`} />
                <span className="text-xs text-slate-400">{item.label}</span>
              </div>
              <span className="text-2xl font-bold text-white">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {lastBooking && (
        <div className="rounded-2xl border border-teal-500/30 bg-teal-950/40 p-5 backdrop-blur">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5 text-teal-400" />
            Latest Booking
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Rooms</span>
              <span className="font-mono text-teal-300">
                {lastBooking.rooms.map((r) => r.number).join(", ")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Travel Time</span>
              <span className="font-mono text-teal-300">
                {lastBooking.totalTravelTime} min
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Floors</span>
              <span className="font-mono text-teal-300">
                {lastBooking.floorsInvolved}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Room IDs</span>
              <span className="font-mono text-teal-300 text-xs">
                {lastBooking.roomIds.map((id) => id.slice(0, 8)).join(", ")}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
