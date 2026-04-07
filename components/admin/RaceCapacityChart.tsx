"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  ResponsiveContainer,
} from "recharts";
import type { Race, Participant } from "@/lib/types";

interface RaceCapacityChartProps {
  races: Race[];
  participants: Participant[];
}

const RaceCapacityChart = ({ races, participants }: RaceCapacityChartProps) => {
  const data = races.map((race) => {
    const registered = participants.filter((p) => p.race === race.id).length;
    const limit = race.limit ?? 0;
    return {
      name: race.name,
      registered: Math.min(registered, limit),
      remaining: Math.max(limit - registered, 0),
      overflow: Math.max(registered - limit, 0),
      total: registered,
      limit,
      color: race.color || "#ff5722",
    };
  });

  if (data.length === 0) {
    return (
      <p className="text-sm text-gray-500 text-center py-8">Žádné strany</p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={races.length * 40 + 20}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ left: 0, right: 50 }}
        barSize={16}
      >
        <XAxis type="number" hide domain={[0, "dataMax"]} />
        <YAxis
          type="category"
          dataKey="name"
          width={120}
          tick={{ fill: "#fafafa", fontSize: 13 }}
          axisLine={false}
          tickLine={false}
        />
        <Bar dataKey="registered" stackId="capacity" radius={[0, 0, 0, 0]}>
          {data.map((d, i) => (
            <Cell
              key={i}
              fill={
                d.color === "#ffffff" || d.color === "#fff"
                  ? "#d1d5db"
                  : d.color
              }
            />
          ))}
        </Bar>
        <Bar
          dataKey="remaining"
          stackId="capacity"
          fill="#525252"
          radius={[0, 4, 4, 0]}
          minPointSize={1}
          label={(props) => {
            const x = Number(props.x ?? 0);
            const y = Number(props.y ?? 0);
            const w = Number(props.width ?? 0);
            const idx = Number(props.index ?? 0);
            const d = data[idx];
            // Even when remaining is 0, recharts calls label with width=0.
            // Position label after the full bar (x is start of remaining segment).
            return (
              <text x={x + w + 5} y={y + 12} fill="#fafafa" fontSize={12}>
                {`${d?.total ?? 0} / ${d?.limit ?? 0}`}
              </text>
            );
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default RaceCapacityChart;
