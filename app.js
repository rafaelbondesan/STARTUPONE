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
  --bg-primary: #0a0e1a;
  --bg-secondary: #111827;
  --bg-card: #151d2e;
  --bg-card-hover: #1a2438;
  --bg-elevated: #1e2942;
  --border: rgba(255,255,255,0.06);
  --border-hover: rgba(255,255,255,0.12);
  --text-primary: #f0f2f5;
  --text-secondary: #8b95a8;
  --text-muted: #5a6478;
  --accent: #06b6d4;
  --accent-dim: rgba(6,182,212,0.12);
  --accent-glow: rgba(6,182,212,0.25);
  --green: #10b981;
  --green-dim: rgba(16,185,129,0.12);
  --yellow: #f59e0b;
  --yellow-dim: rgba(245,158,11,0.12);
  --red: #ef4444;
  --red-dim: rgba(239,68,68,0.12);
  --orange: #f97316;
  --orange-dim: rgba(249,115,22,0.12);
}

* { margin:0; padding:0; box-sizing:border-box; }

body { background: var(--bg-primary); color: var(--text-primary); font-family: 'DM Sans', sans-serif; }

::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border-hover); border-radius: 3px; }

@keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
@keyframes slideIn { from { opacity:0; transform:translateX(-12px); } to { opacity:1; transform:translateX(0); } }
@keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:.5; } }
`;

// ─── COMPONENTS ───
const ScoreBadge = ({ score, size = "md" }) => {
  const color = score >= 3 ? "var(--green)" : score >= 2 ? "var(--yellow)" : "var(--red)";
  const bg = score >= 3 ? "var(--green-dim)" : score >= 2 ? "var(--yellow-dim)" : "var(--red-dim)";
  const sz = size === "lg" ? { font: "28px", w: "64px", h: "64px" } : size === "xl" ? { font: "42px", w: "96px", h: "96px" } : { font: "15px", w: "42px", h: "42px" };
  return (
    <div style={{ width: sz.w, height: sz.h, borderRadius: "12px", background: bg, border: `1.5px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: sz.font, fontWeight: 700, color, fontFamily: "'Outfit', sans-serif", flexShrink: 0 }}>
      {score.toFixed(1)}
    </div>
  );
};

const StatusDot = ({ active }) => (
  <div style={{ width: 8, height: 8, borderRadius: "50%", background: active ? "var(--green)" : "var(--text-muted)", boxShadow: active ? "0 0 8px var(--green)" : "none", flexShrink: 0 }} />
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
  <span style={{ padding: "3px 8px", borderRadius: "5px", fontSize: "10px", fontWeight: 600, background: active ? "var(--green-dim)" : "var(--red-dim)", color: active ? "var(--green)" : "var(--red)", letterSpacing: "0.3px" }}>{label}</span>
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
    <div style={{ fontSize: "28px", fontWeight: 800, fontFamily: "'Outfit', sans-serif", color: "var(--text-primary)", lineHeight: 1 }}>{value}</div>
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

// NOTE: For brevity, this file keeps the Dashboard + sidebar. You can paste the remaining page components (ProjectsPage, IntegrationsPage, etc.) below.

const Sidebar = ({ active, onNav }) => {
  const items = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "projects", icon: FolderKanban, label: "Projetos" },
    { id: "integrations", icon: Link2, label: "Integrações" },
    { id: "alerts", icon: Bell, label: "Alertas", badge: ALERTS.filter(a => a.severity === "critical").length },
    { id: "compliance", icon: FileCheck, label: "Compliance" },
    { id: "settings", icon: Settings, label: "Configurações" },
  ];
  return (
    <div style={{ width: 240, background: "var(--bg-secondary)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", height: "100vh", position: "fixed", left: 0, top: 0, zIndex: 10 }}>
      <div style={{ padding: "24px 20px", display: "flex", alignItems: "center", gap: "10px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ width: 34, height: 34, borderRadius: "10px", background: "linear-gradient(135deg, #06b6d4, #0891b2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Shield size={18} color="#fff" />
        </div>
        <div>
          <div style={{ fontSize: "15px", fontWeight: 700, fontFamily: "'Outfit', sans-serif", color: "var(--text-primary)" }}>SecOrch</div>
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
    </div>
  );
};

const DashboardPage = ({ onNav }) => {
  const avgScore = (PROJECTS.reduce((s, p) => s + p.score, 0) / PROJECTS.length).toFixed(1);
  const totalVulns = PROJECTS.reduce((s, p) => s + p.vulns.critical + p.vulns.high + p.vulns.medium + p.vulns.low, 0);
  const criticalVulns = PROJECTS.reduce((s, p) => s + p.vulns.critical, 0);
  const fullCoverage = PROJECTS.filter(p => p.coverage === 100).length;
  const radarData = SAMM_DOMAINS.map(d => ({ domain: d.domain, score: d.score, full: 4 }));

  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 800, fontFamily: "'Outfit', sans-serif", marginBottom: "4px" }}>Visão Executiva</h1>
        <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Postura de segurança do portfólio. Atualizado em tempo real.</p>
      </div>

      <div style={{ display: "flex", gap: "14px", marginBottom: "24px", flexWrap: "wrap" }}>
        <MetricCard icon={Shield} label="Score médio de maturidade (SAMM)" value={avgScore} sub="+0.3" trend="up" />
        <MetricCard icon={AlertTriangle} label="Vulnerabilidades críticas abertas" value={criticalVulns} sub="-3" trend="up" color="var(--red)" />
        <MetricCard icon={Eye} label="Cobertura total de ferramentas" value={`${fullCoverage}/${PROJECTS.length}`} color="var(--green)" />
        <MetricCard icon={Activity} label="Total de vulnerabilidades" value={totalVulns} sub="-45" trend="up" color="var(--yellow)" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "20px" }}>
          <div style={{ fontSize: "14px", fontWeight: 700, marginBottom: "16px", fontFamily: "'Outfit', sans-serif" }}>Evolução do Score de Maturidade</div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={TREND_DATA}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: "#5a6478", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 4]} tick={{ fill: "#5a6478", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#1e2942", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12, color: "#f0f2f5" }} />
              <Area type="monotone" dataKey="score" stroke="#06b6d4" strokeWidth={2.5} fill="url(#scoreGrad)" dot={{ r: 4, fill: "#06b6d4", strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "20px" }}>
          <div style={{ fontSize: "14px", fontWeight: 700, marginBottom: "16px", fontFamily: "'Outfit', sans-serif" }}>OWASP SAMM - Portfólio</div>
          <ResponsiveContainer width="100%" height={180}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis dataKey="domain" tick={{ fill: "#8b95a8", fontSize: 10 }} />
              <PolarRadiusAxis domain={[0, 4]} tick={false} axisLine={false} />
              <Radar name="Score" dataKey="score" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [page, setPage] = useState("dashboard");

  return (
    <>
      <style>{CSS}</style>
      <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-primary)" }}>
        <Sidebar active={page} onNav={setPage} />
        <main style={{ marginLeft: 240, flex: 1, padding: "28px 32px", maxWidth: "calc(100vw - 240px)" }}>
          {page === "dashboard" && <DashboardPage onNav={setPage} />}
          {page !== "dashboard" && (
            <div style={{ padding: 24, color: "var(--text-secondary)" }}>
              Page '{page}' not included in this shortened sample. Paste the rest of your page components (ProjectsPage, IntegrationsPage, AlertsPage, CompliancePage, SettingsPage) below and switch here.
            </div>
          )}
        </main>
      </div>
    </>
  );
}
