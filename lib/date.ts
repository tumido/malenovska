import type { Timestamp } from "firebase/firestore";

export const timestampToDateStr = (timestamp: Timestamp): string => {
  return timestamp.toDate().toLocaleDateString("cs-CZ");
};

export const timestampToTimeStr = (timestamp: Timestamp): string => {
  return timestamp.toDate().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

/** Converts a Timestamp or time string to a display time string (HH:MM). */
export const toTimeStr = (value: Timestamp | string): string => {
  if (typeof value === "string") return value;
  return timestampToTimeStr(value);
};
