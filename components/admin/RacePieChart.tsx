"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { Race, Participant } from "@/lib/types";

interface RacePieChartProps {
  races: Race[];
  participants: Participant[];
}

const RacePieChart = ({ races, participants }: RacePieChartProps) => {
  const data = races.map((race) => ({
    name: race.name,
    value: participants.filter((p) => p.race === race.id).length,
    color: race.color || "#6366f1",
  }));

  if (data.every((d) => d.value === 0)) {
    return <p className="text-sm text-gray-400 text-center py-8">Žádní účastníci</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={100}
          innerRadius={40}
          dataKey="value"
          nameKey="name"
          label={({ name, value }) => `${name}: ${value}`}
        >
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={entry.color === "#ffffff" || entry.color === "#fff" ? "#d1d5db" : entry.color}
            />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default RacePieChart;
