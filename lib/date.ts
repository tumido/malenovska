import type { Timestamp } from "firebase/firestore";

export function timestampToDateStr(timestamp: Timestamp): string {
  return timestamp.toDate().toLocaleDateString("cs-CZ");
}

export function timestampToTimeStr(timestamp: Timestamp): string {
  return timestamp.toDate().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
