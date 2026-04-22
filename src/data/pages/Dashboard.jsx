import React from "react";
import { PROJECTS } from "../data/projects";
import MetricCard from "../components/MetricCard";

export default function Dashboard() {
  const avg =
    PROJECTS.reduce((a, b) => a + b.score, 0) / PROJECTS.length;

  return (
    <div>
      <h1>Dashboard</h1>

      <div style={{ display: "flex", gap: 10 }}>
        <MetricCard label="Avg Score" value={avg.toFixed(1)} />
        <MetricCard label="Projects" value={PROJECTS.length} />
      </div>

      <div style={{ marginTop: 20 }}>
        {PROJECTS.map(p => (
          <div key={p.id}>
            {p.name} — {p.score}
          </div>
        ))}
      </div>
    </div>
  );
}
