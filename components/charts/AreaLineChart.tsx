"use client";

import { useId, useMemo } from "react";
import type { ChartPoint } from "@/lib/chartData";

export type AreaLineChartProps = {
  data: ChartPoint[];
  height?: number;
  primaryColor?: string;
  showGrid?: boolean;
  showYAxis?: boolean;
  showXAxis?: boolean;
  formatY?: (value: number) => string;
  animate?: boolean;
  className?: string;
};

function smoothLinePath(coords: { x: number; y: number }[]): string {
  if (coords.length < 2) return "";
  let d = `M ${coords[0].x.toFixed(2)} ${coords[0].y.toFixed(2)}`;
  for (let i = 0; i < coords.length - 1; i++) {
    const p0 = coords[Math.max(i - 1, 0)];
    const p1 = coords[i];
    const p2 = coords[i + 1];
    const p3 = coords[Math.min(i + 2, coords.length - 1)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return d;
}

export function AreaLineChart({
  data,
  height = 140,
  primaryColor = "var(--profit)",
  showGrid = true,
  showYAxis = true,
  showXAxis = true,
  formatY = (v) => v.toLocaleString("en-IN"),
  animate = true,
  className = "",
}: AreaLineChartProps) {
  const gradId = useId().replace(/:/g, "");

  const plot = useMemo(() => {
    if (data.length < 2) return null;
    const padL = showYAxis ? 48 : 8;
    const padR = 8;
    const padT = 8;
    const padB = showXAxis ? 22 : 8;
    const width = 560;
    const plotW = width - padL - padR;
    const plotH = height - padT - padB;
    const allY = data.map((d) => d.y);
    let minY = Math.min(...allY);
    let maxY = Math.max(...allY);
    const padY = (maxY - minY) * 0.08 || 1;
    minY -= padY;
    maxY += padY;
    const range = maxY - minY || 1;
    const toX = (i: number) => padL + (i / (data.length - 1)) * plotW;
    const toY = (v: number) => padT + plotH - ((v - minY) / range) * plotH;
    const primaryCoords = data.map((d, i) => ({ x: toX(i), y: toY(d.y) }));
    const linePath = smoothLinePath(primaryCoords);
    const areaPath = `${linePath} L ${toX(data.length - 1).toFixed(2)} ${(padT + plotH).toFixed(2)} L ${toX(0).toFixed(2)} ${(padT + plotH).toFixed(2)} Z`;
    const yTicks = [minY, minY + range * 0.5, maxY];
    const xLabels = data.map((d, i) => ({ i, x: d.x, show: d.label ?? false })).filter((d) => d.show);
    if (xLabels.length === 0) {
      xLabels.push({ i: 0, x: data[0].x, show: true });
      xLabels.push({ i: data.length - 1, x: data[data.length - 1].x, show: true });
    }
    return { width, padL, padT, plotH, linePath, areaPath, yTicks, xLabels, toX, minY, maxY };
  }, [data, height, showXAxis, showYAxis]);

  if (!plot) return null;

  return (
    <div className={`chart-root ${className}`}>
      <div className="chart-body" style={{ height }}>
        {showYAxis && (
          <div className="chart-y-axis" style={{ height }}>
            {[...plot.yTicks].reverse().map((v) => (
              <span key={v} className="chart-y-label">{formatY(v)}</span>
            ))}
          </div>
        )}
        <svg viewBox={`0 0 ${plot.width} ${height}`} className="chart-svg" preserveAspectRatio="none" aria-hidden>
          {showGrid &&
            [0.25, 0.5, 0.75].map((f) => (
              <line key={f} x1={plot.padL} x2={plot.width - 8} y1={plot.padT + f * plot.plotH} y2={plot.padT + f * plot.plotH} className="chart-grid-line" />
            ))}
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={primaryColor} stopOpacity="0.32" />
              <stop offset="100%" stopColor={primaryColor} stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <path d={plot.areaPath} fill={`url(#${gradId})`} />
          <path d={plot.linePath} fill="none" stroke={primaryColor} strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" className={animate ? "chart-line-draw" : undefined} />
        </svg>
      </div>
      {showXAxis && (
        <div className="chart-x-axis" style={{ paddingLeft: plot.padL }}>
          {plot.xLabels.map(({ i, x }) => (
            <span key={`${i}-${x}`} className="chart-x-label" style={{ left: `${(i / (data.length - 1)) * 100}%` }}>{x}</span>
          ))}
        </div>
      )}
    </div>
  );
}
