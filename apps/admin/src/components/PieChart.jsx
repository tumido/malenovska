import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  ResponsiveContainer,
  PieChart as PieReChart,
  Pie,
  Cell,
  Legend,
  Sector,
} from "recharts";
import { truncate } from "lodash/string";
import { Card, CardContent } from "@material-ui/core";

const Shape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >
        {truncate(payload.label, { length: 10, separator: " " })}
        <span style={{ color: "#999" }}> a</span>
      </text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`${value} (${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

const PieChart = ({ data = [] }) => {
  const [active, setActive] = useState(0);

  const handleMouseEnter = (_, idx) => setActive(idx);
  return (
    <Card>
      <CardContent>
        <div style={{ width: "100%", height: 150 }}>
          <ResponsiveContainer>
            <PieReChart>
              <Pie
                activeShape={Shape}
                activeIndex={active}
                onMouseEnter={handleMouseEnter}
                innerRadius={20}
                outerRadius={80}
                startAngle={180}
                cy="100%"
                endAngle={0}
                data={data}
                nameKey="label"
                dataKey="value"
              >
                {data.map((d, index) => (
                  <Cell key={`cell-${index}`} fill={d.color} />
                ))}
              </Pie>
              {/* <Legend
                align="center"
                verticalAlign="bottom"
                layout="horizontal"
                formatter={(v, e) => (
                  <span style={{ color: "black" }}>
                    {truncate(v, { length: 20, separator: " " })}
                  </span>
                )}
              /> */}
            </PieReChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PieChart;
