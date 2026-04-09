import type { Race, Participant } from "@/lib/types";

interface RaceCapacityChartProps {
  races: Race[];
  participants: Participant[];
}

const fixColor = (color: string): string =>
  color === "#ffffff" || color === "#fff" ? "#d1d5db" : color;

const rightRoundedRect = (
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): string => {
  if (w <= 0) return "";
  r = Math.min(r, w / 2, h / 2);
  return `M ${x} ${y} H ${x + w - r} A ${r} ${r} 0 0 1 ${x + w} ${y + r} V ${y + h - r} A ${r} ${r} 0 0 1 ${x + w - r} ${y + h} H ${x} Z`;
};

const RaceCapacityChart = ({ races, participants }: RaceCapacityChartProps) => {
  const data = races.map((race) => {
    const registered = participants.filter((p) => p.race === race.id).length;
    const limit = race.limit ?? 0;
    return {
      name: race.name,
      registered: Math.min(registered, limit),
      remaining: Math.max(limit - registered, 0),
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

  const ROW_H = 40;
  const BAR_H = 16;
  const NAME_W = 120;
  const BAR_START = NAME_W + 10;
  const W = 400;
  const LABEL_W = 55;
  const BAR_W = W - BAR_START - LABEL_W;
  const H = data.length * ROW_H + 20;
  const maxLimit = Math.max(...data.map((d) => d.limit), 1);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      style={{ aspectRatio: `${W} / ${H}` }}
    >
      {data.map((d, i) => {
        const y = i * ROW_H + (ROW_H - BAR_H) / 2 + 10;
        const regW = (d.registered / maxLimit) * BAR_W;
        const remW = (d.remaining / maxLimit) * BAR_W;
        const color = fixColor(d.color);

        return (
          <g key={i}>
            <text
              x={NAME_W}
              y={y + BAR_H / 2 + 5}
              textAnchor="end"
              fill="#fafafa"
              fontSize={13}
            >
              {d.name}
            </text>
            {regW > 0 && (
              <rect
                x={BAR_START}
                y={y}
                width={regW}
                height={BAR_H}
                fill={color}
              />
            )}
            <path
              d={rightRoundedRect(
                BAR_START + regW,
                y,
                Math.max(remW, 1),
                BAR_H,
                4,
              )}
              fill="#525252"
            />
            <text
              x={BAR_START + regW + remW + 5}
              y={y + BAR_H / 2 + 4}
              fill="#fafafa"
              fontSize={12}
            >
              {d.total} / {d.limit}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default RaceCapacityChart;
