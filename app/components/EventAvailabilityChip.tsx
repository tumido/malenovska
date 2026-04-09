
import { Heart, Hourglass } from "lucide-react";
import { useEvent } from "@/contexts/EventContext";
import { timestampToDateStr } from "@/lib/date";

export const EventAvailabilityChip = ({ className }: { className?: string }) => {
  const event = useEvent();

  const isPast = !event.date?.toDate || event.date.toDate() < new Date();

  return isPast ? (
    <span className={`inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-sm text-primary-light ${className ?? ""}`}>
      <Hourglass size={14} />
      Proběhlo
    </span>
  ) : (
    <span className={`inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm text-white ${className ?? ""}`}>
      <Heart size={14} />
      {timestampToDateStr(event.date)}
    </span>
  );
};
