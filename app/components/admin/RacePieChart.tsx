import type { Race, Participant } from "@/lib/types";
import { fixColor } from "@/lib/chart-utils";

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
    return (
      <p className="text-sm text-gray-500 text-center py-8">Žádní účastníci</p>
    );
  }

  const total = data.reduce((sum, d) => sum + d.value, 0);
  const nonZero = data.filter((d) => d.value > 0);

  const CX = 100;
  const CY = 100;
  const OUTER_R = 90;
  const INNER_R = 36;

  let angle = -Math.PI / 2;
  const slices = nonZero.map((d) => {
    const span = (d.value / total) * 2 * Math.PI;
    const startAngle = angle;
    const endAngle = angle + span;
    angle = endAngle;
    return {
      ...d,
      startAngle,
      endAngle,
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
    <div>
      <svg viewBox="0 0 200 200" className="mx-auto w-full max-w-50">
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
      </svg>
      <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1.5">
        {nonZero.map((d, i) => (
          <div
            key={i}
            className="flex items-center gap-1.5 text-sm text-primary-light"
          >
            <span
              className="inline-block h-3 w-3 shrink-0 rounded-sm"
              style={{ backgroundColor: fixColor(d.color) }}
            />
            {d.name}: {d.value}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RacePieChart;
