import { Layer, Rectangle, ResponsiveContainer, Sankey, Tooltip } from "recharts";

function CustomNode({ x, y, width, height, payload }) {
  const isRisk = payload.name.includes("Blocked");
  const fill = isRisk ? "#e2495f" : "#d9b872";
  return (
    <Layer>
      <Rectangle x={x} y={y} width={width} height={height} fill={fill} fillOpacity={0.9} />
      <text
        x={x + width + 8}
        y={y + height / 2}
        textAnchor="start"
        dominantBaseline="middle"
        fill="#eceae4"
        fontSize={12}
      >
        {payload.name}
      </text>
    </Layer>
  );
}

export default function SankeyFlow({ data }) {
  return (
    <ResponsiveContainer width="100%" height={460}>
      <Sankey
        data={data}
        node={<CustomNode />}
        nodePadding={36}
        nodeWidth={10}
        margin={{ top: 20, bottom: 40, left: 20, right: 150 }}
        link={{ stroke: "#d9b872", strokeOpacity: 0.22 }}
      >
        <Tooltip
          contentStyle={{ background: "#14161a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
          labelStyle={{ color: "#eceae4" }}
        />
      </Sankey>
    </ResponsiveContainer>
  );
}
