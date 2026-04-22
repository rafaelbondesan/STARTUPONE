import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";

export function SimpleBarChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Bar dataKey="value" />
      </BarChart>
    </ResponsiveContainer>
  );
}
