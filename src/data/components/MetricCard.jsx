import React from "react";

export default function MetricCard({ label, value }) {
  return (
    <div style={{
      background: "#1a1a1a",
      padding: 20,
      borderRadius: 10,
      flex: 1
    }}>
      <h3>{value}</h3>
      <p>{label}</p>
    </div>
  );
}
