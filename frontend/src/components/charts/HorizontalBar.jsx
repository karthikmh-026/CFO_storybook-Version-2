import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const COLORS = ["#d9b872", "#5fc9ac", "#e2725b", "#e08a5f", "#4f95da", "#a78bfa"];

export default function HorizontalBar({ data, valueKey = "value", labelKey = "name" }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
        <XAxis type="number" hide />
        <YAxis
          dataKey={labelKey}
          type="category"
          tick={{ fill: "var(--text-dim)", fontSize: 11 }}
          axisLine={{ stroke: "rgba(255,255,255,0.12)" }}
          tickLine={false}
          width={150}
        />
        <Tooltip
          cursor={{ fill: "rgba(255,255,255,0.04)" }}
          contentStyle={{ background: "#14161a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
          labelStyle={{ color: "#eceae4" }}
          formatter={(v) => [`₹${v.toFixed(1)} Cr`, ""]}
        />
        <Bar dataKey={valueKey} radius={[0, 3, 3, 0]} animationDuration={900}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
