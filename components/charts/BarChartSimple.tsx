"use client";

type BarItem = { label: string; value: number; color?: string };

type BarChartSimpleProps = {
  data: BarItem[];
  height?: number;
  className?: string;
};

export function BarChartSimple({ data, height = 140, className = "" }: BarChartSimpleProps) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className={`flex items-end gap-2 ${className}`} style={{ height }}>
      {data.map((item) => (
        <div key={item.label} className="flex flex-1 flex-col items-center gap-1">
          <div
            className="chart-bar-grow w-full rounded-t-md"
            style={{ height: `${(item.value / max) * 100}%`, background: item.color ?? "var(--profit)", minHeight: 4 }}
          />
          <span className="text-[10px] font-bold text-[var(--ink-faint)]">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
