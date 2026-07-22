import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#5fc9ac", "#e2725b", "#d9b872", "#4f95da", "#e08a5f", "#a78bfa"];

const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, percent }) => {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 22;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="#eceae4"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={11}
    >
      {name} ({(percent * 100).toFixed(0)}%)
    </text>
  );
};

export default function PieDonut({ data, valueKey = "value", nameKey = "name", chartType }) {
  const isPie = chartType === "pie";

  return (
    <ResponsiveContainer width="100%" height={320}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={isPie ? 0 : 60}
          outerRadius={isPie ? 110 : 85}
          paddingAngle={isPie ? 2 : 4}
          dataKey={valueKey}
          nameKey={nameKey}
          animationDuration={900}
          label={isPie ? renderLabel : undefined}
          labelLine={isPie}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ background: "#14161a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
          labelStyle={{ color: "#eceae4" }}
          formatter={(v) => [`₹${v.toFixed(1)} Cr`, ""]}
        />
        <Legend
          verticalAlign="bottom"
          height={36}
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 11, color: "var(--text-dim)" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
