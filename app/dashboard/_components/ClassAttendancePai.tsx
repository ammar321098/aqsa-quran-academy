"use client";

import {
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell } from "recharts"; // internal use only
import type { ChartConfig } from "@/components/ui/chart";

const chartConfig = {
  Present: {
    label: "Present",
    color: "#22c55e",
  },
  Absent: {
    label: "Absent",
    color: "#ef4444",
  },
  Leave: {
    label: "Leave",
    color: "#f59e0b",
  },
} satisfies ChartConfig;

const COLORS = ["#22c55e", "#ef4444", "#f59e0b"];

export function ClassAttendancePie({
  present,
  absent,
  leave,
}: {
  present: number;
  absent: number;
  leave: number;
}) {
  const data = [
    { name: "Present", value: present },
    { name: "Absent", value: absent },
    { name: "Leave", value: leave },
  ];

  return (
    <ChartContainer config={chartConfig}>
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent />} />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={99}
          label={({ percent }) =>
            percent > 0 ? `${(percent * 100).toFixed(0)}%` : ""
          }
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>

        <ChartLegend />
      </PieChart>
    </ChartContainer>
  );
}
