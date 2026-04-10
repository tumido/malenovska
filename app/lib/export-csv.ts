import { fetchParticipantPrivate } from "@/lib/admin-firestore";
import type { Participant, Race, RegistrationExtra } from "@/lib/types";

export const exportParticipantsCsv = async (
  participants: Participant[],
  races: Race[],
  fieldExtras: RegistrationExtra[],
) => {
  const raceNames = new Map(races.map((r) => [r.id, r.name]));
  const extraHeaders = fieldExtras.map(
    (e) => e.props!.label ?? e.props!.id!,
  );
  const rows: string[][] = [
    ["Strana", "Skupina", "Jméno", "Přezdívka", "Příjmení", ...extraHeaders, "Věk", "E-mail"],
  ];

  for (const p of participants) {
    const priv = await fetchParticipantPrivate(p.id);
    const extraValues = fieldExtras.map((e) => {
      const val = p[e.props!.id!];
      if (e.type === "checkbox") return val ? "Ano" : "Ne";
      return String(val ?? "");
    });
    rows.push([
      raceNames.get(p.race) ?? p.race,
      p.group ?? "",
      p.firstName,
      p.nickName ?? "",
      p.lastName,
      ...extraValues,
      priv?.age?.toString() ?? "",
      priv?.email ?? "",
    ]);
  }

  const csv = rows
    .map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "registrace.csv";
  a.click();
  URL.revokeObjectURL(url);
};
