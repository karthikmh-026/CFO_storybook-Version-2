import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function buildRows(items) {
  let running = 0;
  return items.map((item) => {
    if (item.isSubtotal) {
      running = item.value;
      return { label: item.label, base: 0, bar: item.value, kind: "subtotal", display: item.value };
    }
    const base = item.value >= 0 ? running : running + item.value;
    const bar = Math.abs(item.value);
    running += item.value;
    return {
      label: item.label,
      base,
      bar,
      kind: item.value >= 0 ? "up" : "down",
      display: item.value,
    };
  });
}

const COLORS = {
  subtotal: "#d9b872",
  up: "#5fc9ac",
  down: "#e2725b",
};

export default function WaterfallBridge({ data }) {
  const rows = buildRows(data);

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={rows} margin={{ top: 16, right: 8, left: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: "var(--text-dim)", fontSize: 11 }}
          interval={0}
          axisLine={{ stroke: "rgba(255,255,255,0.12)" }}
          tickLine={false}
        />
        <YAxis hide />
        <Tooltip
          cursor={{ fill: "rgba(255,255,255,0.04)" }}
          contentStyle={{ background: "#14161a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
          labelStyle={{ color: "#eceae4" }}
          formatter={(v, name, props) => [`₹${props.payload.display.toFixed(1)} Cr`, ""]}
        />
        <Bar dataKey="base" stackId="wf" fill="transparent" isAnimationActive={false} />
        <Bar dataKey="bar" stackId="wf" radius={[3, 3, 3, 3]} animationDuration={900}>
          {rows.map((row, i) => (
            <Cell key={i} fill={COLORS[row.kind]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
