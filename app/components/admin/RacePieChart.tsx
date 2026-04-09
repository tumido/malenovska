import type { Race, Participant } from "@/lib/types";

interface RacePieChartProps {
  races: Race[];
  participants: Participant[];
}

const fixColor = (color: string): string =>
  color === "#ffffff" || color === "#fff" ? "#d1d5db" : color;

const RacePieChart = ({ races, participants }: RacePieChartProps) => {
  const data = races.map((race) => ({
    name: race.name,
    value: participants.filter((p) => p.race === race.id).length,
    color: race.color || "#6366f1",
  }));

  if (data.every((d) => d.value === 0)) {
    return (
      <p className="text-sm text-gray-500 text-center py-8">Žádní účastníci</p>
    );
  }

  const total = data.reduce((sum, d) => sum + d.value, 0);
  const nonZero = data.filter((d) => d.value > 0);

  const CX = 225;
  const CY = 150;
  const OUTER_R = 100;
  const INNER_R = 40;
  const LABEL_R = OUTER_R + 25;

  let angle = -Math.PI / 2;
  const slices = nonZero.map((d) => {
    const span = (d.value / total) * 2 * Math.PI;
    const startAngle = angle;
    const endAngle = angle + span;
    const midAngle = angle + span / 2;
    angle = endAngle;
    return {
      ...d,
      startAngle,
      endAngle,
      midAngle,
      largeArc: span > Math.PI ? 1 : 0,
    };
  });

  const donutPath = (s: (typeof slices)[0]): string => {
    const cos1 = Math.cos(s.startAngle),
      sin1 = Math.sin(s.startAngle);
    const cos2 = Math.cos(s.endAngle),
      sin2 = Math.sin(s.endAngle);
    return [
      `M ${CX + OUTER_R * cos1} ${CY + OUTER_R * sin1}`,
      `A ${OUTER_R} ${OUTER_R} 0 ${s.largeArc} 1 ${CX + OUTER_R * cos2} ${CY + OUTER_R * sin2}`,
      `L ${CX + INNER_R * cos2} ${CY + INNER_R * sin2}`,
      `A ${INNER_R} ${INNER_R} 0 ${s.largeArc} 0 ${CX + INNER_R * cos1} ${CY + INNER_R * sin1}`,
      "Z",
    ].join(" ");
  };

  return (
    <svg
      viewBox="0 0 450 300"
      className="w-full max-h-[300px]"
      overflow="visible"
    >
      {slices.length === 1 ? (
        <>
          <circle
            cx={CX}
            cy={CY}
            r={OUTER_R}
            fill={fixColor(slices[0].color)}
          />
          <circle cx={CX} cy={CY} r={INNER_R} className="fill-neutral-800" />
        </>
      ) : (
        slices.map((s, i) => (
          <path key={i} d={donutPath(s)} fill={fixColor(s.color)} />
        ))
      )}
      {slices.map((s, i) => {
        const lx = CX + LABEL_R * Math.cos(s.midAngle);
        const ly = CY + LABEL_R * Math.sin(s.midAngle);
        const anchor = lx > CX ? "start" : "end";
        const lineX = CX + (OUTER_R + 5) * Math.cos(s.midAngle);
        const lineY = CY + (OUTER_R + 5) * Math.sin(s.midAngle);
        return (
          <g key={`l${i}`}>
            <line
              x1={lineX}
              y1={lineY}
              x2={lx}
              y2={ly}
              stroke="#9e9e9e"
              strokeWidth={1}
            />
            <text
              x={lx + (anchor === "start" ? 4 : -4)}
              y={ly + 5}
              textAnchor={anchor}
              fill="#fafafa"
              fontSize={14}
            >
              {s.name}: {s.value}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default RacePieChart;
