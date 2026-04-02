import type { Participant, Race } from "@/lib/types";

export function participantsForRace(participants: Participant[], race: Race): number {
  return participants.filter((p) => p.race === race.id).length;
}

export function getRaceById(races: Race[], id: string): Race | undefined {
  return races.find((race) => id === race.id);
}
