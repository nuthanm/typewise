export type ChartPoint = { x: string; y: number; y2?: number; label?: boolean };

export function seededRandom(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randomWalk(count: number, start: number, end: number, volatility: number, seed: number): number[] {
  const rand = seededRandom(seed);
  const values = [start];
  const drift = (end - start) / (count - 1);
  for (let i = 1; i < count - 1; i++) {
    const prev = values[i - 1];
    const target = start + drift * i;
    const noise = (rand() - 0.5) * volatility * prev;
    const pull = (target - prev) * 0.35;
    values.push(prev + pull + noise);
  }
  values.push(end);
  return values;
}

export function generateDirectoryGrowthCurve(): ChartPoint[] {
  const anchors = [
    { year: 2024, value: 420 },
    { year: 2025, value: 890 },
    { year: 2026, value: 1500 },
    { year: 2027, value: 2800 },
    { year: 2028, value: 4500 },
  ];
  const points: ChartPoint[] = [];
  anchors.forEach((anchor, yi) => {
    const prev = yi === 0 ? anchor.value * 0.85 : anchors[yi - 1].value;
    const segment = randomWalk(12, prev, anchor.value, 0.04, anchor.year);
    segment.forEach((v, mi) => {
      points.push({
        x: mi === 0 ? String(anchor.year) : "",
        y: Math.round(v),
        label: mi === 0,
      });
    });
  });
  return points;
}
