import { useState } from "react";
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

const W = 450;
const H = 250;
const PAD = { top: 20, right: 15, bottom: 30, left: 35 };
const chartW = W - PAD.left - PAD.right;
const chartH = H - PAD.top - PAD.bottom;

const formatDate = (d: Date): string =>
  `${d.getDate()}. ${d.getMonth() + 1}.`;

const niceStep = (range: number, target: number): number => {
  if (range <= 0) return 1;
  const rough = range / target;
  const mag = Math.pow(10, Math.floor(Math.log10(rough)));
  const res = rough / mag;
  return (res <= 1.5 ? 1 : res <= 3 ? 2 : res <= 7 ? 5 : 10) * mag;
};

const buildSmoothPath = (points: { x: number; y: number }[]): string => {
  if (points.length < 2) return "";
  if (points.length === 2)
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    d += ` C ${p1.x + (p2.x - p0.x) / 6} ${p1.y + (p2.y - p0.y) / 6}, ${p2.x - (p3.x - p1.x) / 6} ${p2.y - (p3.y - p1.y) / 6}, ${p2.x} ${p2.y}`;
  }
  return d;
};

const RegistrationTimelineChart = ({
  participants,
  races,
  eventDate,
}: RegistrationTimelineChartProps) => {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const raceMap = new Map(races.map((r) => [r.id, r.name]));

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

  const byDate = new Map<
    string,
    { date: Date; count: number; byRace: Record<string, number> }
  >();
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

  let cumulative = 0;
  const data: DataPoint[] = [...byDate.values()].map(
    ({ date, count, byRace }) => {
      cumulative += count;
      return {
        timestamp: date.getTime(),
        label: formatDate(date),
        total: cumulative,
        delta: count,
        byRace,
      };
    },
  );

  const eventTimestamp = eventDate?.getTime();
  const eventLabel = eventDate ? formatDate(eventDate) : null;
  if (eventTimestamp && eventTimestamp > data[data.length - 1].timestamp) {
    data.push({
      timestamp: eventTimestamp,
      label: eventLabel!,
      total: cumulative,
      delta: 0,
      byRace: {},
    });
  }

  const minTs = data[0].timestamp;
  const maxTs = data[data.length - 1].timestamp;
  const tsRange = maxTs - minTs || 1;
  const maxVal = data[data.length - 1].total;
  const step = niceStep(maxVal, 4);
  const yMax = Math.ceil(maxVal / step) * step || 1;
  const yTicks: number[] = [];
  for (let v = 0; v <= yMax; v += step) yTicks.push(v);

  const xScale = (ts: number) => PAD.left + ((ts - minTs) / tsRange) * chartW;
  const yScale = (val: number) =>
    PAD.top + chartH - (val / yMax) * chartH;
  const baseY = yScale(0);

  const tickCount = Math.min(6, data.length);
  const xStep = tsRange / Math.max(tickCount - 1, 1);
  const xTicks = Array.from({ length: tickCount }, (_, i) =>
    minTs + Math.round(xStep * i),
  );

  const points = data.map((d) => ({
    x: xScale(d.timestamp),
    y: yScale(d.total),
  }));
  const linePath = buildSmoothPath(points);
  const areaPath =
    linePath +
    ` L ${points[points.length - 1].x} ${baseY} L ${points[0].x} ${baseY} Z`;

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left) / rect.width) * W;
    if (svgX < PAD.left || svgX > W - PAD.right) {
      setActiveIdx(null);
      return;
    }
    const ratio = (svgX - PAD.left) / chartW;
    const targetTs = minTs + ratio * tsRange;
    let nearest = 0;
    let minDist = Infinity;
    data.forEach((d, i) => {
      const dist = Math.abs(d.timestamp - targetTs);
      if (dist < minDist) {
        minDist = dist;
        nearest = i;
      }
    });
    setActiveIdx(nearest);
  };

  const activePoint = activeIdx !== null ? data[activeIdx] : null;

  return (
    <div className="relative overflow-visible" style={{ aspectRatio: `${W} / ${H}` }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-full w-full"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setActiveIdx(null)}
      >
        {/* Grid */}
        {yTicks.map((v) => (
          <line
            key={`yg${v}`}
            x1={PAD.left}
            y1={yScale(v)}
            x2={W - PAD.right}
            y2={yScale(v)}
            stroke="#404040"
            strokeDasharray="3 3"
          />
        ))}
        {xTicks.map((ts) => (
          <line
            key={`xg${ts}`}
            x1={xScale(ts)}
            y1={PAD.top}
            x2={xScale(ts)}
            y2={baseY}
            stroke="#404040"
            strokeDasharray="3 3"
          />
        ))}
        {/* X axis */}
        <line
          x1={PAD.left}
          y1={baseY}
          x2={W - PAD.right}
          y2={baseY}
          stroke="#555"
        />
        {xTicks.map((ts) => (
          <text
            key={`xt${ts}`}
            x={xScale(ts)}
            y={baseY + 16}
            textAnchor="middle"
            fill="#9e9e9e"
            fontSize={11}
          >
            {formatDate(new Date(ts))}
          </text>
        ))}
        {/* Y axis */}
        {yTicks.map((v) => (
          <text
            key={`yt${v}`}
            x={PAD.left - 6}
            y={yScale(v) + 4}
            textAnchor="end"
            fill="#9e9e9e"
            fontSize={12}
          >
            {v}
          </text>
        ))}
        {/* Area + line */}
        <path d={areaPath} fill="#ff5722" fillOpacity={0.15} />
        <path d={linePath} fill="none" stroke="#ff5722" strokeWidth={2} />
        {/* Data point on hover */}
        {activePoint && (
          <>
            <line
              x1={xScale(activePoint.timestamp)}
              y1={PAD.top}
              x2={xScale(activePoint.timestamp)}
              y2={baseY}
              stroke="#555"
              strokeDasharray="3 3"
            />
            <circle
              cx={xScale(activePoint.timestamp)}
              cy={yScale(activePoint.total)}
              r={4}
              fill="#ff5722"
            />
          </>
        )}
        {/* Event date reference line */}
        {eventTimestamp && eventLabel && (
          <>
            <line
              x1={xScale(eventTimestamp)}
              y1={PAD.top}
              x2={xScale(eventTimestamp)}
              y2={baseY}
              stroke="#9e9e9e"
              strokeDasharray="4 4"
            />
            <text
              x={xScale(eventTimestamp)}
              y={PAD.top - 5}
              textAnchor="middle"
              fill="#9e9e9e"
              fontSize={11}
            >
              Akce ({eventLabel})
            </text>
          </>
        )}
      </svg>
      {/* Tooltip */}
      {activePoint && (
        <div
          className="pointer-events-none absolute z-10 whitespace-nowrap rounded-lg border border-gray-600 bg-neutral-900 px-3 py-2 text-sm shadow-lg"
          style={{
            left: `${(xScale(activePoint.timestamp) / W) * 100}%`,
            top: `${(yScale(activePoint.total) / H) * 100}%`,
            transform: "translate(-50%, calc(-100% - 8px))",
          }}
        >
          <p className="mb-1 font-semibold text-primary-light">
            {activePoint.label}
          </p>
          <p className="text-gray-400">
            Celkem: {activePoint.total}{" "}
            {activePoint.delta > 0 && (
              <span className="text-green-400">(+{activePoint.delta})</span>
            )}
          </p>
          {(() => {
            const raceEntries = Object.entries(activePoint.byRace)
              .filter(([, count]) => count > 0)
              .sort((a, b) => b[1] - a[1]);
            if (raceEntries.length === 0) return null;
            return (
              <div className="mt-1 space-y-0.5 border-t border-gray-700 pt-1">
                {raceEntries.map(([raceId, count]) => (
                  <p key={raceId} className="text-gray-300">
                    {raceMap.get(raceId) ?? raceId}:{" "}
                    <span className="text-green-400">+{count}</span>
                  </p>
                ))}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default RegistrationTimelineChart;
