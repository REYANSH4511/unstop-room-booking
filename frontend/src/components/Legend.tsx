import { ArrowUpDown } from "lucide-react";

export default function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500/40" />
        <span>Available</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded bg-red-500/30 border border-red-500/40" />
        <span>Occupied</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded bg-blue-500/30 border border-blue-500/40 ring-1 ring-blue-400/50" />
        <span>Newly Booked</span>
      </div>
      <div className="flex items-center gap-1.5">
        <ArrowUpDown className="w-3 h-3 text-amber-400" />
        <span>Lift / Stairs (left side)</span>
      </div>
      <div className="flex items-center gap-1.5 ml-auto">
        <span className="text-slate-500">Horizontal: 1 min/room</span>
        <span className="text-slate-600">|</span>
        <span className="text-slate-500">Vertical: 2 min/floor</span>
      </div>
    </div>
  );
}
