import React from "react";
import { LayoutDashboard, FolderKanban, Bell, Settings } from "lucide-react";

export default function Sidebar({ active, onNav }) {
  const items = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "projects", label: "Projects", icon: FolderKanban },
    { id: "alerts", label: "Alerts", icon: Bell },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div style={{
      width: 240,
      position: "fixed",
      height: "100vh",
      background: "#111",
      padding: 20
    }}>
      <h2>SecOrch</h2>

      {items.map(i => (
        <button
          key={i.id}
          onClick={() => onNav(i.id)}
          style={{
            display: "block",
            width: "100%",
            marginTop: 10,
            background: active === i.id ? "#333" : "transparent",
            color: "#fff",
            border: "none",
            padding: 10,
            cursor: "pointer"
          }}
        >
          <i.icon size={16} /> {i.label}
        </button>
      ))}
    </div>
  );
}
