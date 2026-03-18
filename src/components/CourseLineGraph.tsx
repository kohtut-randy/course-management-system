"use client";

import { useMemo } from "react";

interface CourseLineGraphProps {
  createdAtDates: string[];
  days?: number;
}

function formatDateLabel(date: Date) {
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

export default function CourseLineGraph({
  createdAtDates,
  days = 7,
}: CourseLineGraphProps) {
  const data = useMemo(() => {
    const now = new Date();
    const counts: Record<string, number> = {};

    // Initialize last N days
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      counts[key] = 0;
    }

    // Count courses per day
    createdAtDates.forEach((createdAt) => {
      const key = new Date(createdAt).toISOString().slice(0, 10);
      if (counts[key] !== undefined) {
        counts[key] += 1;
      }
    });

    const points = Object.entries(counts).map(([key, value]) => {
      const date = new Date(key);
      return {
        date,
        label: formatDateLabel(date),
        value,
      };
    });

    return points;
  }, [createdAtDates, days]);

  const max = Math.max(...data.map((d) => d.value), 1);
  const width = 360;
  const height = 120;
  const padding = 24;

  const path = data
    .map((point, idx) => {
      const x = padding + (idx / (data.length - 1)) * (width - padding * 2);
      const y = height - padding - (point.value / max) * (height - padding * 2);
      return `${idx === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium">
          Courses created (last {days} days)
        </div>
        <div className="text-xs text-gray-500">
          Total {data.reduce((sum, d) => sum + d.value, 0)}
        </div>
      </div>
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id="lineGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        <path
          d={`${path} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`}
          fill="url(#lineGradient)"
        />
        <path
          d={path}
          fill="none"
          stroke="#2563EB"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {data.map((point, idx) => {
          const x = padding + (idx / (data.length - 1)) * (width - padding * 2);
          const y =
            height - padding - (point.value / max) * (height - padding * 2);
          return (
            <g key={point.label}>
              <circle cx={x} cy={y} r={4} fill="#2563EB" />
              <text
                x={x}
                y={height - padding + 14}
                textAnchor="middle"
                className="text-[10px] fill-gray-500"
              >
                {point.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
