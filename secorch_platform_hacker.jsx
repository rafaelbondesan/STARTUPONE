import { useState, useEffect } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, PieChart, Pie, Cell, Area, AreaChart, CartesianGrid } from "recharts";
import { Shield, LayoutDashboard, FolderKanban, Link2, Bell, FileCheck, Settings, ChevronRight, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, XCircle, Search, Filter, ChevronDown, ArrowUpRight, Clock, Users, GitBranch, Eye, Zap, BarChart3, Activity, Lock, Unlock, ExternalLink, RefreshCw, Plus, MoreHorizontal } from "lucide-react";

// ─── MOCK DATA ───
const PROJECTS = [
  { id: 1, name: "payments-api", team: "Payments", criticality: "Critical", lang: "Java", score: 3.2, prevScore: 2.8, trend: "up", sast: true, sca: true, dast: true, secrets: true, compliance: ["PCI DSS"], lastScan: "2h ago", vulns: { critical: 2, high: 8, medium: 23, low: 45 }, coverage: 100 },
  { id: 2, name: "user-portal", team: "Identity", criticality: "High", lang: "React/Node", score: 2.7, prevScore: 2.5, trend: "up", sast: true, sca: true, dast: false, secrets: true, compliance: ["LGPD", "SOC2"], lastScan: "4h ago", vulns: { critical: 0, high: 3, medium: 15, low: 30 }, coverage: 75 },
  { id: 3, name: "data-pipeline", team: "Data Eng", criticality: "High", lang: "Python", score: 1.9, prevScore: 2.1, trend: "down", sast: true, sca: false, dast: false, secrets: false, compliance: ["LGPD"], lastScan: "2d ago", vulns: { critical: 5, high: 12, medium: 34, low: 67 }, coverage: 25 },
  { id: 4, name: "mobile-app", team: "Mobile", criticality: "Medium", lang: "Kotlin/Swift", score: 2.4, prevScore: 2.0, trend: "up", sast: true, sca: true, dast: false, secrets: true, compliance: [], lastScan: "6h ago", vulns: { critical: 1, high: 5, medium: 18, low: 22 }, coverage: 75 },
  { id: 5, name: "admin-dashboard", team: "Platform", criticality: "Medium", lang: "React", score: 3.5, prevScore: 3.3, trend: "up", sast: true, sca: true, dast: true, secrets: true, compliance: ["SOC2"], lastScan: "1h ago", vulns: { critical: 0, high: 1, medium: 8, low: 15 }, coverage: 100 },
  { id: 6, name: "notification-svc", team: "Platform", criticality: "Low", lang: "Go", score: 2.1, prevScore: 2.1, trend: "stable", sast: true, sca: true, dast: false, secrets: false, compliance: [], lastScan: "5d ago", vulns: { critical: 0, high: 4, medium: 11, low: 20 }, coverage: 50 },
  { id: 7, name: "checkout-flow", team: "Payments", criticality: "Critical", lang: "TypeScript", score: 2.9, prevScore: 2.4, trend: "up", sast: true, sca: true, dast: true, secrets: true, compliance: ["PCI DSS", "LGPD"], lastScan: "30m ago", vulns: { critical: 1, high: 6, medium: 20, low: 38 }, coverage: 100 },
  { id: 8, name: "internal-tools", team: "Engineering", criticality: "Low", lang: "Python", score: 1.2, prevScore: 1.0, trend: "up", sast: false, sca: false, dast: false, secrets: false, compliance: [], lastScan: "never", vulns: { critical: 0, high: 0, medium: 0, low: 0 }, coverage: 0 },
];

const SAMM_DOMAINS = [
  { domain: "Governance", score: 2.8, practices: [{ name: "Strategy & Metrics", score: 3.0 }, { name: "Policy & Compliance", score: 2.5 }, { name: "Education & Guidance", score: 2.8 }] },
  { domain: "Design", score: 2.4, practices: [{ name: "Threat Assessment", score: 2.2 }, { name: "Security Requirements", score: 2.8 }, { name: "Security Architecture", score: 2.1 }] },
  { domain: "Implementation", score: 2.6, practices: [{ name: "Secure Build", score: 3.0 }, { name: "Secure Deployment", score: 2.5 }, { name: "Defect Management", score: 2.2 }] },
  { domain: "Verification", score: 2.1, practices: [{ name: "Architecture Assessment", score: 1.8 }, { name: "Requirements Testing", score: 2.5 }, { name: "Security Testing", score: 2.0 }] },
  { domain: "Operations", score: 1.9, practices: [{ name: "Incident Management", score: 2.2 }, { name: "Environment Management", score: 1.8 }, { name: "Operational Management", score: 1.6 }] },
];

const TREND_DATA = [
  { month: "Nov", score: 1.8, vulns: 340 }, { month: "Dec", score: 2.0, vulns: 310 },
  { month: "Jan", score: 2.1, vulns: 285 }, { month: "Feb", score: 2.3, vulns: 260 },
  { month: "Mar", score: 2.5, vulns: 230 }, { month: "Apr", score: 2.6, vulns: 215 },
];

const INTEGRATIONS = [
  { name: "GitHub", type: "SCM", status: "connected", repos: 142, icon: "GH", color: "#333" },
  { name: "GitLab", type: "SCM", status: "connected", repos: 38, icon: "GL", color: "#FC6D26" },
  { name: "Snyk", type: "SCA", status: "connected", repos: 95, icon: "SN", color: "#4C4A73" },
  { name: "SonarQube", type: "SAST", status: "connected", repos: 120, icon: "SQ", color: "#4E9BCD" },
  { name: "Checkmarx", type: "SAST", status: "disconnected", repos: 0, icon: "CX", color: "#54B848" },
  { name: "OWASP ZAP", type: "DAST", status: "connected", repos: 42, icon: "ZP", color: "#00549E" },
  { name: "Gitleaks", type: "Secrets", status: "connected", repos: 180, icon: "GL", color: "#E44D26" },
  { name: "Trivy", type: "Container", status: "partial", repos: 60, icon: "TR", color: "#1904DA" },
];

const ALERTS = [
  { id: 1, severity: "critical", project: "data-pipeline", message: "Nenhum scan de secrets configurado", type: "gap", time: "2h" },
  { id: 2, severity: "critical", project: "internal-tools", message: "Projeto sem nenhuma ferramenta de seguran\u00E7a integrada", type: "gap", time: "5d" },
  { id: 3, severity: "high", project: "data-pipeline", message: "SCA n\u00E3o configurado - depend\u00EAncias n\u00E3o monitoradas", type: "gap", time: "2d" },
  { id: 4, severity: "high", project: "payments-api", message: "2 vulnerabilidades cr\u00EDticas abertas h\u00E1 mais de 7 dias", type: "vuln", time: "7d" },
  { id: 5, severity: "high", project: "notification-svc", message: "DAST n\u00E3o configurado para servi\u00E7o exposto externamente", type: "gap", time: "3d" },
  { id: 6, severity: "medium", project: "user-portal", message: "DAST n\u00E3o configurado", type: "gap", time: "1d" },
  { id: 7, severity: "medium", project: "mobile-app", message: "Score de maturidade abaixo do target do time", type: "maturity", time: "12h" },
  { id: 8, severity: "low", project: "checkout-flow", message: "Scan de DAST n\u00E3o executado nas \u00FAltimas 48h", type: "stale", time: "2d" },
];

// ─── STYLES ───
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700&family=Outfit:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  /* Base: near-black with subtle depth */
  --bg-primary: #050607;
  --bg-secondary: #07090a;
  --bg-card: #0b0d0f;
  --bg-card-hover: #0f1215;
  --bg-elevated: #0d1012;

  /* Borders: yellow-tinted, low contrast */
  --border: rgba(245, 199, 39, 0.12);
  --border-hover: rgba(245, 199, 39, 0.22);

  /* Text: terminal-like */
  --text-primary: #f5f5f5;
  --text-secondary: rgba(245, 245, 245, 0.72);
  --text-muted: rgba(245, 245, 245, 0.45);

  /* Accent: hacker yellow */
  --accent: #f5c727;
  --accent-dim: rgba(245, 199, 39, 0.12);
  --accent-glow: rgba(245, 199, 39, 0.28);

  /* Semantic colours: keep readable against black */
  --green: #22c55e;
  --green-dim: rgba(34, 197, 94, 0.12);

  --yellow: #f5c727;
  --yellow-dim: rgba(245, 199, 39, 0.14);

  --red: #ff3b30;
  --red-dim: rgba(255, 59, 48, 0.14);

  --orange: #ff8a1f;
  --orange-dim: rgba(255, 138, 31, 0.14);
}
* { margin:0; padding:0; box-sizing:border-box; }

body { background: var(--bg-primary); color: var(--text-primary); font-family: 'DM Sans', sans-serif; }

::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border-hover); border-radius: 3px; }

@keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
@keyframes slideIn { from { opacity:0; transform:translateX(-12px); } to { opacity:1; transform:translateX(0); } }
@keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:.5; } }

/* Subtle scanlines */
body::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  background: repeating-linear-gradient(
    to bottom,
    rgba(245, 199, 39, 0.03),
    rgba(245, 199, 39, 0.03) 1px,
    rgba(0, 0, 0, 0) 3px,
    rgba(0, 0, 0, 0) 6px
  );
  mix-blend-mode: overlay;
  opacity: 0.35;
}

/* Crisp focus ring */
button:focus-visible, input:focus-visible {
  outline: 2px solid rgba(245,199,39,0.55);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(245,199,39,0.12);
}

/* Slightly more console feel */
* { text-rendering: geometricPrecision; }

`;

// ─── COMPONENTS ───
const ScoreBadge = ({ score, size = "md" }) => {
  const color = score >= 3 ? "var(--green)" : score >= 2 ? "var(--yellow)" : "var(--red)";
  const bg = score >= 3 ? "var(--green-dim)" : score >= 2 ? "var(--yellow-dim)" : "var(--red-dim)";
  const sz = size === "lg" ? { font: "28px", w: "64px", h: "64px" } : size === "xl" ? { font: "42px", w: "96px", h: "96px" } : { font: "15px", w: "42px", h: "42px" };
  return (
    <div style={{ width: sz.w, height: sz.h, borderRadius: "12px", background: bg, border: `1.5px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: sz.font, fontWeight: 700, color, fontFamily: "'JetBrains Mono', monospace", flexShrink: 0 }}>
      {score.toFixed(1)}
    </div>
  );
};

const StatusDot = ({ active }) => (
 <div
   style={{
     width: 8,
     height: 8,
     borderRadius: "50%",
     background: active ? "var(--green)" : "rgba(245,199,39,0.22)",
     boxShadow: active ? "0 0 8px var(--green)" : "0 0 6px rgba(245,199,39,0.12)",
     flexShrink: 0,
   }}
 />
);

const CriticalityBadge = ({ level }) => {
  const map = { Critical: { bg: "var(--red-dim)", color: "var(--red)" }, High: { bg: "var(--orange-dim)", color: "var(--orange)" }, Medium: { bg: "var(--yellow-dim)", color: "var(--yellow)" }, Low: { bg: "var(--accent-dim)", color: "var(--accent)" } };
  const s = map[level] || map.Low;
  return <span style={{ padding: "3px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 600, background: s.bg, color: s.color, letterSpacing: "0.3px" }}>{level}</span>;
};

const SeverityBadge = ({ severity }) => {
  const map = { critical: { bg: "var(--red-dim)", color: "var(--red)", label: "CRITICAL" }, high: { bg: "var(--orange-dim)", color: "var(--orange)", label: "HIGH" }, medium: { bg: "var(--yellow-dim)", color: "var(--yellow)", label: "MEDIUM" }, low: { bg: "var(--accent-dim)", color: "var(--accent)", label: "LOW" } };
  const s = map[severity];
  return <span style={{ padding: "3px 10px", borderRadius: "6px", fontSize: "10px", fontWeight: 700, background: s.bg, color: s.color, letterSpacing: "0.5px" }}>{s.label}</span>;
};

const ToolBadge = ({ active, label }) => (
  <span style={{ padding: "3px 8px", borderRadius: "5px", fontSize: "10px", fontWeight: 600, background: active ? "var(--green-dim)" : "var(--red-dim)", color: active ? "var(--green)" : "var(--red)", letterSpacing: "0.3px" }}>
    {label}
  </span>
);

const MetricCard = ({ icon: Icon, label, value, sub, trend, color = "var(--accent)" }) => (
  <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "20px", flex: 1, minWidth: 180, animation: "fadeIn 0.4s ease" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
      <div style={{ width: 36, height: 36, borderRadius: "10px", background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={18} color={color} />
      </div>
      {trend && (
        <div style={{ display: "flex", alignItems: "center", gap: "3px", fontSize: "12px", fontWeight: 600, color: trend === "up" ? "var(--green)" : "var(--red)" }}>
          {trend === "up" ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          {sub}
        </div>
      )}
    </div>
    <div style={{ fontSize: "28px", fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", color: "var(--text-primary)", lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "6px" }}>{label}</div>
  </div>
);

const CoverageBar = ({ pct }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%" }}>
    <div style={{ flex: 1, height: 6, borderRadius: 3, background: "var(--bg-elevated)", overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${pct}%`, borderRadius: 3, background: pct === 100 ? "var(--green)" : pct >= 50 ? "var(--yellow)" : "var(--red)", transition: "width 0.6s ease" }} />
    </div>
    <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", width: 36, textAlign: "right" }}>{pct}%</span>
  </div>
);

// ─── SIDEBAR ───
const Sidebar = ({ active, onNav }) => {
  const items = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "projects", icon: FolderKanban, label: "Projetos" },
    { id: "integrations", icon: Link2, label: "Integra\u00E7\u00F5es" },
    { id: "alerts", icon: Bell, label: "Alertas", badge: ALERTS.filter(a => a.severity === "critical").length },
    { id: "compliance", icon: FileCheck, label: "Compliance" },
    { id: "settings", icon: Settings, label: "Configura\u00E7\u00F5es" },
  ];
  return (
    <div style={{ width: 240, background: "var(--bg-secondary)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", height: "100vh", position: "fixed", left: 0, top: 0, zIndex: 10 }}>
      <div style={{ padding: "24px 20px", display: "flex", alignItems: "center", gap: "10px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ width: 34, height: 34, borderRadius: "10px", background: "linear-gradient(135deg, #f5c727, #caa21f)", boxShadow: "0 0 14px rgba(245,199,39,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Shield size={18} color="#fff" />
        </div>
        <div>
          <div style={{ fontSize: "15px", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: "var(--text-primary)" }}>SecOrch</div>
          <div style={{ fontSize: "10px", color: "var(--text-muted)", letterSpacing: "1px", textTransform: "uppercase" }}>DevSecOps Platform</div>
        </div>
      </div>

      <div style={{ padding: "12px 10px", flex: 1 }}>
        {items.map(item => (
          <button key={item.id} onClick={() => onNav(item.id)} style={{
            display: "flex", alignItems: "center", gap: "10px", width: "100%", padding: "10px 12px",
            borderRadius: "10px", border: "none", cursor: "pointer", marginBottom: "2px", transition: "all 0.15s",
            background: active === item.id ? "var(--accent-dim)" : "transparent",
            color: active === item.id ? "var(--accent)" : "var(--text-secondary)",
          }}>
            <item.icon size={18} />
            <span style={{ fontSize: "13px", fontWeight: active === item.id ? 600 : 400, flex: 1, textAlign: "left" }}>{item.label}</span>
            {item.badge > 0 && (
              <span style={{ background: "var(--red)", color: "#fff", fontSize: "10px", fontWeight: 700, padding: "2px 6px", borderRadius: "8px", minWidth: 18, textAlign: "center" }}>{item.badge}</span>
            )}
          </button>
        ))}
      </div>

      <div style={{ padding: "16px", borderTop: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--bg-elevated)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: "var(--accent)" }}>AM</div>
          <div>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-primary)" }}>Amanda Mendes</div>
            <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>Head of AppSec</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── DASHBOARD PAGE ───
const DashboardPage = ({ onNav }) => {
  const avgScore = (PROJECTS.reduce((s, p) => s + p.score, 0) / PROJECTS.length).toFixed(1);
  const totalVulns = PROJECTS.reduce((s, p) => s + p.vulns.critical + p.vulns.high + p.vulns.medium + p.vulns.low, 0);
  const criticalVulns = PROJECTS.reduce((s, p) => s + p.vulns.critical, 0);
  const fullCoverage = PROJECTS.filter(p => p.coverage === 100).length;
  const radarData = SAMM_DOMAINS.map(d => ({ domain: d.domain, score: d.score, full: 4 }));
  const critByLevel = [
    { name: "Critical", value: PROJECTS.filter(p => p.criticality === "Critical").length, color: "var(--red)" },
    { name: "High", value: PROJECTS.filter(p => p.criticality === "High").length, color: "var(--orange)" },
    { name: "Medium", value: PROJECTS.filter(p => p.criticality === "Medium").length, color: "var(--yellow)" },
    { name: "Low", value: PROJECTS.filter(p => p.criticality === "Low").length, color: "var(--accent)" },
  ];

  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", marginBottom: "4px" }}>Vis\u00E3o Executiva</h1>
        <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Postura de seguran\u00E7a do portf\u00F3lio. Atualizado em tempo real.</p>
      </div>

      <div style={{ display: "flex", gap: "14px", marginBottom: "24px", flexWrap: "wrap" }}>
        <MetricCard icon={Shield} label="Score m\u00E9dio de maturidade (SAMM)" value={avgScore} sub="+0.3" trend="up" />
        <MetricCard icon={AlertTriangle} label="Vulnerabilidades cr\u00EDticas abertas" value={criticalVulns} sub="-3" trend="up" color="var(--red)" />
        <MetricCard icon={Eye} label="Cobertura total de ferramentas" value={`${fullCoverage}/${PROJECTS.length}`} color="var(--green)" />
        <MetricCard icon={Activity} label="Total de vulnerabilidades" value={totalVulns} sub="-45" trend="up" color="var(--yellow)" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
        {/* Trend Chart */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "20px", animation: "fadeIn 0.5s ease" }}>
          <div style={{ fontSize: "14px", fontWeight: 700, marginBottom: "16px", fontFamily: "'JetBrains Mono', monospace" }}>Evolu\u00E7\u00E3o do Score de Maturidade</div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={TREND_DATA}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: "#5a6478", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 4]} tick={{ fill: "#5a6478", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#1e2942", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12, color: "#f0f2f5" }} />
              <Area type="monotone" dataKey="score" stroke="var(--accent)" strokeWidth={2.5} fill="url(#scoreGrad)" dot={{ r: 4, fill: "var(--accent)", strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* OWASP SAMM Radar */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "20px", animation: "fadeIn 0.6s ease" }}>
          <div style={{ fontSize: "14px", fontWeight: 700, marginBottom: "16px", fontFamily: "'JetBrains Mono', monospace" }}>OWASP SAMM - Portf\u00F3lio</div>
          <ResponsiveContainer width="100%" height={180}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis dataKey="domain" tick={{ fill: "#8b95a8", fontSize: 10 }} />
              <PolarRadiusAxis domain={[0, 4]} tick={false} axisLine={false} />
              <Radar name="Score" dataKey="score" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Projects Table */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "20px", animation: "fadeIn 0.7s ease" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div style={{ fontSize: "14px", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>Score de Maturidade por Projeto</div>
          <button onClick={() => onNav("projects")} style={{ display: "flex", alignItems: "center", gap: "4px", background: "none", border: "none", color: "var(--accent)", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
            Ver todos <ChevronRight size={14} />
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Projeto", "Time", "Criticidade", "Score", "Cobertura", "Vulns (C/H)", "Tools", "\u00DAltimo scan"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 12px", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", borderBottom: "1px solid var(--border)", letterSpacing: "0.5px", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PROJECTS.map(p => (
                <tr key={p.id} style={{ cursor: "pointer" }} onMouseEnter={e => e.currentTarget.style.background = "var(--bg-card-hover)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "12px", fontSize: "13px", fontWeight: 600, borderBottom: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "'JetBrains Mono', monospace" }}>
                      <GitBranch size={14} color="var(--text-muted)" />
                      {p.name}
                    </div>
                  </td>
                  <td style={{ padding: "12px", fontSize: "12px", color: "var(--text-secondary)", borderBottom: "1px solid var(--border)" }}>{p.team}</td>
                  <td style={{ padding: "12px", borderBottom: "1px solid var(--border)" }}><CriticalityBadge level={p.criticality} /></td>
                  <td style={{ padding: "12px", borderBottom: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <ScoreBadge score={p.score} />
                      {p.trend === "up" && <TrendingUp size={13} color="var(--green)" />}
                      {p.trend === "down" && <TrendingDown size={13} color="var(--red)" />}
                    </div>
                  </td>
                  <td style={{ padding: "12px", borderBottom: "1px solid var(--border)", minWidth: 120 }}><CoverageBar pct={p.coverage} /></td>
                  <td style={{ padding: "12px", fontSize: "13px", borderBottom: "1px solid var(--border)" }}>
                    <span style={{ color: p.vulns.critical > 0 ? "var(--red)" : "var(--text-secondary)", fontWeight: p.vulns.critical > 0 ? 700 : 400 }}>{p.vulns.critical}</span>
                    <span style={{ color: "var(--text-muted)" }}> / </span>
                    <span style={{ color: p.vulns.high > 0 ? "var(--orange)" : "var(--text-secondary)" }}>{p.vulns.high}</span>
                  </td>
                  <td style={{ padding: "12px", borderBottom: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                      <ToolBadge active={p.sast} label="SAST" />
                      <ToolBadge active={p.sca} label="SCA" />
                      <ToolBadge active={p.dast} label="DAST" />
                      <ToolBadge active={p.secrets} label="SEC" />
                    </div>
                  </td>
                  <td style={{ padding: "12px", fontSize: "12px", color: "var(--text-muted)", borderBottom: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}><Clock size={12} /> {p.lastScan}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ─── PROJECTS PAGE ───
const ProjectsPage = () => {
  const [selected, setSelected] = useState(null);
  const project = PROJECTS.find(p => p.id === selected);

  if (project) {
    const projectRadar = SAMM_DOMAINS.map(d => ({ domain: d.domain, score: Math.min(4, d.score * (project.score / 2.5)), full: 4 }));
    return (
      <div>
        <button onClick={() => setSelected(null)} style={{ display: "flex", alignItems: "center", gap: "4px", background: "none", border: "none", color: "var(--accent)", fontSize: "13px", fontWeight: 600, cursor: "pointer", marginBottom: "20px" }}>
          \u2190 Voltar aos projetos
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px" }}>
          <ScoreBadge score={project.score} size="lg" />
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: 800, fontFamily: "'JetBrains Mono', monospace" }}>{project.name}</h1>
            <div style={{ display: "flex", gap: "12px", alignItems: "center", marginTop: "4px" }}>
              <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{project.team}</span>
              <CriticalityBadge level={project.criticality} />
              <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{project.lang}</span>
              {project.compliance.map(c => <span key={c} style={{ padding: "2px 8px", borderRadius: "4px", fontSize: "10px", fontWeight: 600, background: "var(--accent-dim)", color: "var(--accent)" }}>{c}</span>)}
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "20px" }}>
            <div style={{ fontSize: "14px", fontWeight: 700, marginBottom: "16px", fontFamily: "'JetBrains Mono', monospace" }}>OWASP SAMM Breakdown</div>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={projectRadar}>
                <PolarGrid stroke="rgba(255,255,255,0.06)" />
                <PolarAngleAxis dataKey="domain" tick={{ fill: "#8b95a8", fontSize: 11 }} />
                <PolarRadiusAxis domain={[0, 4]} tick={false} axisLine={false} />
                <Radar dataKey="score" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.2} strokeWidth={2} dot={{ r: 3, fill: "var(--accent)" }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "20px" }}>
            <div style={{ fontSize: "14px", fontWeight: 700, marginBottom: "16px", fontFamily: "'JetBrains Mono', monospace" }}>Vulnerabilidades</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {[{ label: "Critical", val: project.vulns.critical, color: "var(--red)" }, { label: "High", val: project.vulns.high, color: "var(--orange)" }, { label: "Medium", val: project.vulns.medium, color: "var(--yellow)" }, { label: "Low", val: project.vulns.low, color: "var(--accent)" }].map(v => (
                <div key={v.label} style={{ background: "var(--bg-elevated)", borderRadius: "10px", padding: "14px", textAlign: "center" }}>
                  <div style={{ fontSize: "28px", fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", color: v.color }}>{v.val}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>{v.label}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "16px" }}>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "8px" }}>Cobertura de ferramentas</div>
              <CoverageBar pct={project.coverage} />
            </div>
          </div>
        </div>

        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "20px" }}>
          <div style={{ fontSize: "14px", fontWeight: 700, marginBottom: "16px", fontFamily: "'JetBrains Mono', monospace" }}>Ferramentas integradas</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "10px" }}>
            {[{ name: "SAST", active: project.sast, tool: "SonarQube" }, { name: "SCA", active: project.sca, tool: "Snyk" }, { name: "DAST", active: project.dast, tool: "OWASP ZAP" }, { name: "Secrets", active: project.secrets, tool: "Gitleaks" }].map(t => (
              <div key={t.name} style={{ background: "var(--bg-elevated)", borderRadius: "10px", padding: "14px", border: t.active ? "1px solid rgba(16,185,129,0.2)" : "1px solid rgba(239,68,68,0.2)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  {t.active ? <CheckCircle size={16} color="var(--green)" /> : <XCircle size={16} color="var(--red)" />}
                  <span style={{ fontSize: "13px", fontWeight: 600 }}>{t.name}</span>
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{t.active ? t.tool : "N\u00E3o configurado"}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", marginBottom: "4px" }}>Projetos</h1>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{PROJECTS.length} projetos monitorados</p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "8px", padding: "8px 12px" }}>
            <Search size={14} color="var(--text-muted)" />
            <input placeholder="Buscar projeto..." style={{ background: "none", border: "none", outline: "none", color: "var(--text-primary)", fontSize: "12px", width: 160, fontFamily: "'DM Sans'" }} />
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
        {PROJECTS.map(p => (
          <div key={p.id} onClick={() => setSelected(p.id)} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "18px", cursor: "pointer", transition: "all 0.15s", animation: "fadeIn 0.4s ease" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border-hover)"; e.currentTarget.style.background = "var(--bg-card-hover)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--bg-card)"; }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 700, marginBottom: "4px", fontFamily: "'JetBrains Mono', monospace" }}>{p.name}</div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{p.team}</span>
                  <CriticalityBadge level={p.criticality} />
                </div>
              </div>
              <ScoreBadge score={p.score} />
            </div>
            <CoverageBar pct={p.coverage} />
            <div style={{ display: "flex", gap: "4px", marginTop: "12px", flexWrap: "wrap" }}>
              <ToolBadge active={p.sast} label="SAST" />
              <ToolBadge active={p.sca} label="SCA" />
              <ToolBadge active={p.dast} label="DAST" />
              <ToolBadge active={p.secrets} label="SEC" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── INTEGRATIONS PAGE ───
const IntegrationsPage = () => (
  <div>
    <div style={{ marginBottom: "24px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", marginBottom: "4px" }}>Integra\u00E7\u00F5es</h1>
      <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Ferramentas conectadas ao pipeline de seguran\u00E7a</p>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" }}>
      {INTEGRATIONS.map(t => (
        <div key={t.name} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "20px", animation: "fadeIn 0.4s ease" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: 40, height: 40, borderRadius: "10px", background: `${t.color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 700, color: t.color, fontFamily: "'JetBrains Mono'" }}>{t.icon}</div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 700 }}>{t.name}</div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{t.type}</div>
              </div>
            </div>
            <StatusDot active={t.status === "connected"} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
              {t.status === "connected" ? `${t.repos} repos` : t.status === "partial" ? `${t.repos} repos (parcial)` : "Desconectado"}
            </span>
            <button style={{ background: t.status === "disconnected" ? "var(--accent)" : "var(--bg-elevated)", border: "none", borderRadius: "6px", padding: "6px 12px", fontSize: "11px", fontWeight: 600, color: t.status === "disconnected" ? "#fff" : "var(--text-secondary)", cursor: "pointer" }}>
              {t.status === "disconnected" ? "Conectar" : "Configurar"}
            </button>
          </div>
        </div>
      ))}
      <div style={{ background: "var(--bg-card)", border: "2px dashed var(--border)", borderRadius: "14px", padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px", cursor: "pointer", minHeight: 130 }}>
        <Plus size={24} color="var(--text-muted)" />
        <span style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 500 }}>Adicionar integra\u00E7\u00E3o</span>
      </div>
    </div>
  </div>
);

// ─── ALERTS PAGE ───
const AlertsPage = () => (
  <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
      <div>
        <h1 style={{ fontSize: "24px", fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", marginBottom: "4px" }}>Alertas</h1>
        <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Gaps de cobertura e vulnerabilidades priorit\u00E1rias</p>
      </div>
      <div style={{ display: "flex", gap: "6px" }}>
        {["Todos", "Gaps", "Vulns", "Maturidade"].map(f => (
          <button key={f} style={{ padding: "6px 14px", borderRadius: "8px", border: "1px solid var(--border)", background: f === "Todos" ? "var(--accent-dim)" : "transparent", color: f === "Todos" ? "var(--accent)" : "var(--text-secondary)", fontSize: "12px", fontWeight: 500, cursor: "pointer" }}>{f}</button>
        ))}
      </div>
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {ALERTS.map(a => (
        <div key={a.id} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "14px", animation: "fadeIn 0.3s ease", cursor: "pointer", transition: "all 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-hover)"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
          <SeverityBadge severity={a.severity} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "13px", fontWeight: 500, marginBottom: "2px" }}>{a.message}</div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              <span style={{ fontFamily: "'JetBrains Mono'", color: "var(--accent)" }}>{a.project}</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "var(--text-muted)" }}>
            <Clock size={12} /> {a.time}
          </div>
          <ChevronRight size={16} color="var(--text-muted)" />
        </div>
      ))}
    </div>
  </div>
);

// ─── COMPLIANCE PAGE ───
const CompliancePage = () => {
  const frameworks = [
    { name: "PCI DSS v4.x", status: "Em progresso", pct: 72, projects: 2, controls: { total: 64, met: 46, partial: 12, missing: 6 } },
    { name: "LGPD", status: "Em progresso", pct: 58, projects: 3, controls: { total: 32, met: 18, partial: 10, missing: 4 } },
    { name: "SOC2 Type II", status: "Inicial", pct: 35, projects: 2, controls: { total: 48, met: 17, partial: 15, missing: 16 } },
  ];
  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", marginBottom: "4px" }}>Compliance</h1>
        <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Status de conformidade por framework regulat\u00F3rio</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {frameworks.map(fw => (
          <div key={fw.name} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "24px", animation: "fadeIn 0.4s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "18px" }}>
              <div>
                <div style={{ fontSize: "17px", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", marginBottom: "4px" }}>{fw.name}</div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{fw.projects} projetos afetados</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "28px", fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", color: fw.pct >= 70 ? "var(--green)" : fw.pct >= 50 ? "var(--yellow)" : "var(--red)" }}>{fw.pct}%</div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>ader\u00EAncia</div>
              </div>
            </div>
            <div style={{ height: 8, borderRadius: 4, background: "var(--bg-elevated)", overflow: "hidden", marginBottom: "18px" }}>
              <div style={{ height: "100%", width: `${fw.pct}%`, borderRadius: 4, background: fw.pct >= 70 ? "var(--green)" : fw.pct >= 50 ? "var(--yellow)" : "var(--red)", transition: "width 0.8s ease" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
              {[{ label: "Atendidos", val: fw.controls.met, color: "var(--green)" }, { label: "Parcial", val: fw.controls.partial, color: "var(--yellow)" }, { label: "Pendentes", val: fw.controls.missing, color: "var(--red)" }].map(c => (
                <div key={c.label} style={{ background: "var(--bg-elevated)", borderRadius: "8px", padding: "12px", textAlign: "center" }}>
                  <div style={{ fontSize: "22px", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: c.color }}>{c.val}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{c.label}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── SETTINGS PAGE ───
const SettingsPage = () => (
  <div>
    <div style={{ marginBottom: "24px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", marginBottom: "4px" }}>Configura\u00E7\u00F5es</h1>
      <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Pol\u00EDticas de seguran\u00E7a e gates adaptativos</p>
    </div>

    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "24px", marginBottom: "16px" }}>
      <div style={{ fontSize: "15px", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", marginBottom: "16px" }}>Gates Adaptativos por Criticidade</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {[
          { level: "Critical", rules: "SAST + SCA + DAST + Secrets obrigat\u00F3rios. Bloqueia critical e high.", score: "M\u00EDnimo 3.0" },
          { level: "High", rules: "SAST + SCA + Secrets obrigat\u00F3rios. Bloqueia critical.", score: "M\u00EDnimo 2.5" },
          { level: "Medium", rules: "SAST + SCA obrigat\u00F3rios. Alerta em critical.", score: "M\u00EDnimo 2.0" },
          { level: "Low", rules: "SAST recomendado. Sem bloqueio.", score: "Sem m\u00EDnimo" },
        ].map(g => (
          <div key={g.level} style={{ background: "var(--bg-elevated)", borderRadius: "10px", padding: "16px", display: "flex", alignItems: "center", gap: "16px" }}>
            <CriticalityBadge level={g.level} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{g.rules}</div>
            </div>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--accent)" }}>{g.score}</div>
            <button style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "6px", padding: "6px 10px", fontSize: "11px", color: "var(--text-secondary)", cursor: "pointer" }}>Editar</button>
          </div>
        ))}
      </div>
    </div>

    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "24px" }}>
      <div style={{ fontSize: "15px", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", marginBottom: "16px" }}>Configura\u00E7\u00F5es Gerais</div>
      {[
        { label: "Notifica\u00E7\u00F5es de gaps de cobertura", desc: "Alertar quando um projeto n\u00E3o tem ferramenta obrigat\u00F3ria", on: true },
        { label: "Bloqueio autom\u00E1tico de deploy", desc: "Impedir deploy quando score abaixo do m\u00EDnimo", on: false },
        { label: "Relat\u00F3rio semanal autom\u00E1tico", desc: "Enviar resumo executivo toda segunda-feira", on: true },
        { label: "Sync cont\u00EDnuo de vulnerabilidades", desc: "Atualizar dados das ferramentas a cada 15min", on: true },
      ].map(s => (
        <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid var(--border)" }}>
          <div>
            <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "2px" }}>{s.label}</div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{s.desc}</div>
          </div>
          <div style={{ width: 44, height: 24, borderRadius: 12, background: s.on ? "var(--accent)" : "var(--bg-elevated)", cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: s.on ? 23 : 3, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ─── MAIN APP ───
export default function App() {
  const [page, setPage] = useState("dashboard");

  return (
    <>
      <style>{CSS}</style>
      <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-primary)" }}>
        <Sidebar active={page} onNav={setPage} />
        <main style={{ marginLeft: 240, flex: 1, padding: "28px 32px", maxWidth: "calc(100vw - 240px)" }}>
          {page === "dashboard" && <DashboardPage onNav={setPage} />}
          {page === "projects" && <ProjectsPage />}
          {page === "integrations" && <IntegrationsPage />}
          {page === "alerts" && <AlertsPage />}
          {page === "compliance" && <CompliancePage />}
          {page === "settings" && <SettingsPage />}
        </main>
      </div>
    </>
  );
}
