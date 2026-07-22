import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const BUCKET_COLORS = ["#5fc9ac", "#d9b872", "#e08a5f", "#e2495f"];

export default function AgeingBars({ data, valueKey = "amountCr", labelKey = "bucket" }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
        <XAxis
          dataKey={labelKey}
          tick={{ fill: "var(--text-dim)", fontSize: 11 }}
          axisLine={{ stroke: "rgba(255,255,255,0.12)" }}
          tickLine={false}
        />
        <YAxis hide />
        <Tooltip
          cursor={{ fill: "rgba(255,255,255,0.04)" }}
          contentStyle={{ background: "#14161a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
          labelStyle={{ color: "#eceae4" }}
          formatter={(v) => [`₹${v.toFixed(1)} Cr`, "Outstanding"]}
        />
        <Bar dataKey={valueKey} radius={[3, 3, 0, 0]} animationDuration={900}>
          {data.map((_, i) => (
            <Cell key={i} fill={BUCKET_COLORS[i % BUCKET_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
