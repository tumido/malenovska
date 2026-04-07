"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
  Tooltip,
} from "recharts";
import type { Participant, Race } from "@/lib/types";

interface RegistrationTimelineChartProps {
  participants: Participant[];
  races: Race[];
  eventDate?: Date | null;
}

interface DataPoint {
  timestamp: number;
  label: string;
  total: number;
  delta: number;
  byRace: Record<string, number>;
}

const formatDate = (d: Date): string =>
  `${d.getDate()}. ${d.getMonth() + 1}.`;

const CustomTooltip = ({
  active,
  payload,
  raceMap,
}: {
  active?: boolean;
  payload?: { payload: DataPoint }[];
  raceMap: Map<string, string>;
}) => {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;

  const raceEntries = Object.entries(point.byRace)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1]);

  return (
    <div className="rounded-lg border border-gray-600 bg-neutral-900 px-3 py-2 text-sm shadow-lg">
      <p className="font-semibold text-primary-light mb-1">{point.label}</p>
      <p className="text-gray-400">
        Celkem: {point.total}{" "}
        {point.delta > 0 && (
          <span className="text-green-400">(+{point.delta})</span>
        )}
      </p>
      {raceEntries.length > 0 && (
        <div className="mt-1 border-t border-gray-700 pt-1 space-y-0.5">
          {raceEntries.map(([raceId, count]) => (
            <p key={raceId} className="text-gray-300">
              {raceMap.get(raceId) ?? raceId}: <span className="text-green-400">+{count}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

const RegistrationTimelineChart = ({
  participants,
  races,
  eventDate,
}: RegistrationTimelineChartProps) => {
  const raceMap = new Map(races.map((r) => [r.id, r.name]));

  // Parse dates and keep race info
  const dated = participants
    .filter((p) => p.createdate)
    .map((p) => {
      const d =
        typeof p.createdate === "object" && "toDate" in p.createdate!
          ? (p.createdate as { toDate: () => Date }).toDate()
          : new Date(p.createdate as unknown as string);
      return { date: d, race: p.race };
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  if (dated.length === 0) {
    return (
      <p className="text-sm text-gray-500 text-center py-8">
        Žádná data o registracích
      </p>
    );
  }

  // Group by date with per-race breakdown
  const byDate = new Map<string, { date: Date; count: number; byRace: Record<string, number> }>();
  for (const { date, race } of dated) {
    const key = date.toISOString().slice(0, 10);
    const existing = byDate.get(key);
    if (existing) {
      existing.count += 1;
      existing.byRace[race] = (existing.byRace[race] ?? 0) + 1;
    } else {
      byDate.set(key, { date, count: 1, byRace: { [race]: 1 } });
    }
  }

  // Build cumulative data
  let cumulative = 0;
  const entries = [...byDate.values()];
  const data: DataPoint[] = entries.map(({ date, count, byRace }) => {
    cumulative += count;
    return { timestamp: date.getTime(), label: formatDate(date), total: cumulative, delta: count, byRace };
  });

  // Add event date point if it's after the last registration
  const eventTimestamp = eventDate?.getTime();
  const eventLabel = eventDate ? formatDate(eventDate) : null;
  if (eventTimestamp && eventTimestamp > data[data.length - 1].timestamp) {
    data.push({ timestamp: eventTimestamp, label: eventLabel!, total: cumulative, delta: 0, byRace: {} });
  }

  // Compute evenly spaced ticks (max ~6)
  const timestamps = data.map((d) => d.timestamp);
  const minTs = timestamps[0];
  const maxTs = timestamps[timestamps.length - 1];
  const tickCount = Math.min(6, data.length);
  const step = (maxTs - minTs) / (tickCount - 1);
  const ticks = Array.from({ length: tickCount }, (_, i) => minTs + Math.round(step * i));

  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
        <XAxis
          dataKey="timestamp"
          type="number"
          domain={[minTs, maxTs]}
          ticks={ticks}
          tickFormatter={(ts: number) => formatDate(new Date(ts))}
          tick={{ fill: "#9e9e9e", fontSize: 11 }}
          axisLine={{ stroke: "#555" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#9e9e9e", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip
          content={<CustomTooltip raceMap={raceMap} />}
          cursor={{ stroke: "#555", strokeDasharray: "3 3" }}
        />
        <Area
          type="monotone"
          dataKey="total"
          stroke="#ff5722"
          fill="#ff5722"
          fillOpacity={0.15}
          strokeWidth={2}
        />
        {eventTimestamp && eventLabel && (
          <ReferenceLine
            x={eventTimestamp}
            stroke="#9e9e9e"
            strokeDasharray="4 4"
            label={{ value: `Akce (${eventLabel})`, fill: "#9e9e9e", fontSize: 11, position: "top" }}
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default RegistrationTimelineChart;
