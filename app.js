/** @jsx React.createElement */

const { useState } = React;

const {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} = Recharts;

const {
  Shield, LayoutDashboard, FolderKanban, Bell,
  FileCheck, Settings, ChevronRight, TrendingUp,
  TrendingDown, AlertTriangle, CheckCircle, XCircle,
  Search, Clock, GitBranch, Eye, Activity
} = lucideReact;

const CSS = `
:root {
  --bg-primary:#050607;
  --bg-secondary:#07090a;
  --bg-card:#0b0d0f;
  --bg-elevated:#0d1012;
  --border:rgba(245,199,39,.15);
  --text-primary:#f5f5f5;
  --text-secondary:rgba(245,245,245,.7);
  --accent:#f5c727;
  --green:#22c55e;
  --red:#ff3b30;
}
body { font-family:'DM Sans',sans-serif; background:var(--bg-primary); color:var(--text-primary);} 
`;

function App() {
  return (
    <>
      <style>{CSS}</style>
      <div style={{padding:40}}>
        <h1 style={{fontFamily:'JetBrains Mono'}}>SecOrch Hacker UI</h1>
        <p style={{color:'var(--text-secondary)'}}>Static demo loaded successfully.</p>
      </div>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
