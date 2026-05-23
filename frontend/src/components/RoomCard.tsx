import type { IRoom } from "../types";

interface RoomCardProps {
  room: IRoom;
  isNewlyBooked: boolean;
}

export default function RoomCard({ room, isNewlyBooked }: RoomCardProps) {
  const statusClass =
    room.status === "available"
      ? "room-available"
      : room.status === "occupied"
        ? "room-occupied"
        : "room-booked";

  return (
    <div
      className={`room-card ${statusClass} ${isNewlyBooked ? "ring-2 ring-white/50 scale-105" : ""}`}
      title={`Room ${room.number} - ${room.status} (Floor ${room.floor}, Position ${room.position})`}
    >
      {room.position === 1 && (
        <span className="absolute left-1 top-1/2 -translate-y-1/2 text-amber-400/80 text-[10px] font-bold">▲</span>
      )}
      <span className="ml-3">{room.number}</span>
    </div>
  );
}
