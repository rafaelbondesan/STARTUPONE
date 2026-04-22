import React, { useState } from "react";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Integrations from "./pages/Integrations";
import Alerts from "./pages/Alerts";
import Compliance from "./pages/Compliance";
import Settings from "./pages/Settings";

export default function App() {
  const [page, setPage] = useState("dashboard");

  const renderPage = () => {
    switch (page) {
      case "projects": return <Projects />;
      case "integrations": return <Integrations />;
      case "alerts": return <Alerts />;
      case "compliance": return <Compliance />;
      case "settings": return <Settings />;
      default: return <Dashboard onNav={setPage} />;
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar active={page} onNav={setPage} />
      <main style={{ marginLeft: 240, padding: 30, width: "100%" }}>
        {renderPage()}
      </main>
    </div>
  );
}
