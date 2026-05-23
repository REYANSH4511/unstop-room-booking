import { useState } from "react";
import { BookOpen, Dices, RotateCcw, Minus, Plus, Loader2 } from "lucide-react";

interface BookingControlsProps {
  onBook: (count: number) => void;
  onRandom: () => void;
  onReset: () => void;
  loading: boolean;
  availableCount: number;
}

export default function BookingControls({
  onBook,
  onRandom,
  onReset,
  loading,
  availableCount,
}: BookingControlsProps) {
  const [count, setCount] = useState(1);

  const increment = () => setCount((c) => Math.min(c + 1, Math.min(5, availableCount)));
  const decrement = () => setCount((c) => Math.max(c - 1, 1));

  const canBook = count >= 1 && count <= 5 && count <= availableCount && !loading;

  return (
    <div className="rounded-2xl border border-slate-700/50 bg-slate-900/80 p-5 backdrop-blur">
      <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-teal-400" />
        Booking Controls
      </h2>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-400">Rooms to book</span>
          <div className="flex items-center gap-2">
            <button
              onClick={decrement}
              disabled={count <= 1 || loading}
              className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-600 flex items-center justify-center text-slate-300 hover:bg-slate-700 disabled:opacity-40 transition"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-bold text-lg">{count}</span>
            <button
              onClick={increment}
              disabled={count >= 5 || count >= availableCount || loading}
              className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-600 flex items-center justify-center text-slate-300 hover:bg-slate-700 disabled:opacity-40 transition"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <button
          onClick={() => onBook(count)}
          disabled={!canBook}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <BookOpen className="w-4 h-4" />
          )}
          Book {count} Room{count > 1 ? "s" : ""}
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={onRandom}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-slate-600 text-slate-300 text-sm font-medium hover:bg-slate-700 transition disabled:opacity-40"
        >
          <Dices className="w-4 h-4" />
          Random Occupancy
        </button>

        <button
          onClick={onReset}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-slate-600 text-slate-300 text-sm font-medium hover:bg-slate-700 transition disabled:opacity-40"
        >
          <RotateCcw className="w-4 h-4" />
          Reset All
        </button>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Max 5 rooms. Available: {availableCount} / 97
      </p>
    </div>
  );
}
