import type { IRoom } from "../types";
import RoomCard from "./RoomCard";

interface FloorGridProps {
  rooms: IRoom[];
  newlyBookedIds: string[];
}

export default function FloorGrid({ rooms, newlyBookedIds }: FloorGridProps) {
  // Group rooms by floor, descending (10 at top, 1 at bottom)
  const floors = new Map<number, IRoom[]>();
  for (const room of rooms) {
    if (!floors.has(room.floor)) floors.set(room.floor, []);
    floors.get(room.floor)!.push(room);
  }

  const sortedFloors = Array.from(floors.entries()).sort((a, b) => b[0] - a[0]);

  return (
    <div className="space-y-3">
      {sortedFloors.map(([floor, floorRooms]) => (
        <div key={floor} className="flex items-center gap-3">
          <div className="w-16 shrink-0 text-right">
            <span className="text-xs font-semibold text-slate-400">
              Floor {floor}
            </span>
          </div>
          <div className="flex-1 grid grid-cols-10 gap-1.5">
            {floorRooms
              .sort((a, b) => a.number - b.number)
              .map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  isNewlyBooked={newlyBookedIds.includes(room.id)}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
