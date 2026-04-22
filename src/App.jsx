import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Area, AreaChart, CartesianGrid } from "recharts";
import { Shield, LayoutDashboard, FolderKanban, Link2, Bell, FileCheck, Settings, ChevronRight, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, XCircle, Search, Clock, GitBranch, Eye, Activity, Plus } from "lucide-react";

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
  { domain: "Governance", score: 2.8 },
  { domain: "Design", score: 2.4 },
  { domain: "Implementation", score: 2.6 },
  { domain: "Verification", score: 2.1 },
  { domain: "Operations", score: 1.9 },
];

const TREND_DATA = [
  { month: "Nov", score: 1.8, vulns: 340 }, { month: "Dec", score: 2.0, vulns: 310 },
  { month: "Jan", score: 2.1, vulns: 285 }, { month: "Feb", score: 2.3, vulns: 260 },
  { month: "Mar", score: 2.5, vulns: 230 }, { month: "Apr", score: 2.6, vulns: 215 },
];

const INTEGRATIONS = [
  { name: "GitHub", type: "SCM", status: "connected", repos: 142, icon: "GH", color: "#e8e8e8" },
  { name: "GitLab", type: "SCM", status: "connected", repos: 38, icon: "GL", color: "#FC6D26" },
  { name: "Snyk", type: "SCA", status: "connected", repos: 95, icon: "SN", color: "#4C4A73" },
  { name: "SonarQube", type: "SAST", status: "connected", repos: 120, icon: "SQ", color: "#4E9BCD" },
  { name: "Checkmarx", type: "SAST", status: "disconnected", repos: 0, icon: "CX", color: "#54B848" },
  { name: "OWASP ZAP", type: "DAST", status: "connected", repos: 42, icon: "ZP", color: "#00549E" },
  { name: "Gitleaks", type: "Secrets", status: "connected", repos: 180, icon: "GK", color: "#E44D26" },
  { name: "Trivy", type: "Container", status: "partial", repos: 60, icon: "TR", color: "#1904DA" },
];

const ALERTS = [
  { id: 1, severity: "critical", project: "data-pipeline", message: "Nenhum scan de secrets configurado", type: "gap", time: "2h" },
  { id: 2, severity: "critical", project: "internal-tools", message: "Projeto sem nenhuma ferramenta de seguran\u00e7a integrada", type: "gap", time: "5d" },
  { id: 3, severity: "high", project: "data-pipeline", message: "SCA n\u00e3o configurado \u2014 depend\u00eancias n\u00e3o monitoradas", type: "gap", time: "2d" },
  { id: 4, severity: "high", project: "payments-api", message: "2 vulnerabilidades cr\u00edticas abertas h\u00e1 mais de 7 dias", type: "vuln", time: "7d" },
  { id: 5, severity: "high", project: "notification-svc", message: "DAST n\u00e3o configurado para servi\u00e7o exposto externamente", type: "gap", time: "3d" },
  { id: 6, severity: "medium", project: "user-portal", message: "DAST n\u00e3o configurado", type: "gap", time: "1d" },
  { id: 7, severity: "medium", project: "mobile-app", message: "Score de maturidade abaixo do target do time", type: "maturity", time: "12h" },
  { id: 8, severity: "low", project: "checkout-flow", message: "Scan de DAST n\u00e3o executado nas \u00faltimas 48h", type: "stale", time: "2d" },
];

// ─── GLOBAL STYLES ───
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700&family=Outfit:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --bg-primary: #0c0d14;
  --bg-secondary: #12131c;
  --bg-card: #16171f;
  --bg-card-hover: #1c1d28;
  --bg-elevated: #22232e;
  --border: rgba(245,197,66,0.08);
  --border-hover: rgba(245,197,66,0.18);
  --text-primary: #f0f0f0;
  --text-secondary: #9a9bae;
  --text-muted: #5c5d6e;
  --accent: #f5c542;
  --accent-dim: rgba(245,197,66,0.10);
  --accent-glow: rgba(245,197,66,0.25);
  --accent-dark: #c49a1a;
  --green: #34d399;
  --green-dim: rgba(52,211,153,0.12);
  --yellow: #fbbf24;
  --yellow-dim: rgba(251,191,36,0.12);
  --red: #f87171;
  --red-dim: rgba(248,113,113,0.12);
  --orange: #fb923c;
  --orange-dim: rgba(251,146,60,0.12);
}

* { margin:0; padding:0; box-sizing:border-box; }
html, body, #root { height: 100%; }
body { background: var(--bg-primary); color: var(--text-primary); font-family: 'DM Sans', sans-serif; }

::-webkit-scrollbar { width: 5px; height: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border-hover); border-radius: 3px; }

@keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
`;

// ─── SMALL COMPONENTS ───
const ScoreBadge = ({ score, size = "md" }) => {
  const color = score >= 3 ? "var(--green)" : score >= 2 ? "var(--accent)" : "var(--red)";
  const bg = score >= 3 ? "var(--green-dim)" : score >= 2 ? "var(--accent-dim)" : "var(--red-dim)";
  const dim = size === "lg" ? { fs: "28px", w: 64 } : { fs: "15px", w: 42 };
  return (
    <div style={{ width: dim.w, height: dim.w, borderRadius: 12, background: bg, border: `1.5px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: dim.fs, fontWeight: 700, color, fontFamily: "'Outfit',sans-serif", flexShrink: 0 }}>
      {score.toFixed(1)}
    </div>
  );
};

const CriticalityBadge = ({ level }) => {
  const m = { Critical: { bg: "var(--red-dim)", c: "var(--red)" }, High: { bg: "var(--orange-dim)", c: "var(--orange)" }, Medium: { bg: "var(--yellow-dim)", c: "var(--yellow)" }, Low: { bg: "var(--accent-dim)", c: "var(--accent)" } };
  const s = m[level] || m.Low;
  return <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: s.bg, color: s.c, letterSpacing: "0.3px" }}>{level}</span>;
};

const SeverityBadge = ({ severity }) => {
  const m = { critical: { bg: "var(--red-dim)", c: "var(--red)", l: "CRITICAL" }, high: { bg: "var(--orange-dim)", c: "var(--orange)", l: "HIGH" }, medium: { bg: "var(--yellow-dim)", c: "var(--yellow)", l: "MEDIUM" }, low: { bg: "var(--accent-dim)", c: "var(--accent)", l: "LOW" } };
  const s = m[severity];
  return <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 10, fontWeight: 700, background: s.bg, color: s.c, letterSpacing: "0.5px" }}>{s.l}</span>;
};

const ToolBadge = ({ active, label }) => (
  <span style={{ padding: "3px 8px", borderRadius: 5, fontSize: 10, fontWeight: 600, background: active ? "var(--green-dim)" : "var(--red-dim)", color: active ? "var(--green)" : "var(--red)", letterSpacing: "0.3px" }}>{label}</span>
);

const MetricCard = ({ icon: Icon, label, value, sub, trend, color = "var(--accent)" }) => (
  <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: 20, flex: 1, minWidth: 180, animation: "fadeIn 0.4s ease" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={18} color={color} />
      </div>
      {trend && <div style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 12, fontWeight: 600, color: trend === "up" ? "var(--green)" : "var(--red)" }}>{trend === "up" ? <TrendingUp size={13} /> : <TrendingDown size={13} />}{sub}</div>}
    </div>
    <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Outfit',sans-serif", lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 6 }}>{label}</div>
  </div>
);

const CoverageBar = ({ pct }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
    <div style={{ flex: 1, height: 6, borderRadius: 3, background: "var(--bg-elevated)", overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${pct}%`, borderRadius: 3, background: pct === 100 ? "var(--green)" : pct >= 50 ? "var(--accent)" : "var(--red)", transition: "width 0.6s ease" }} />
    </div>
    <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", width: 36, textAlign: "right" }}>{pct}%</span>
  </div>
);

// ─── SIDEBAR ───
const Sidebar = ({ active, onNav }) => {
  const items = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "projects", icon: FolderKanban, label: "Projetos" },
    { id: "integrations", icon: Link2, label: "Integra\u00e7\u00f5es" },
    { id: "alerts", icon: Bell, label: "Alertas", badge: ALERTS.filter(a => a.severity === "critical").length },
    { id: "compliance", icon: FileCheck, label: "Compliance" },
    { id: "settings", icon: Settings, label: "Configura\u00e7\u00f5es" },
  ];
  return (
    <div style={{ width: 240, background: "var(--bg-secondary)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", height: "100vh", position: "fixed", left: 0, top: 0, zIndex: 10 }}>
      <div style={{ padding: "24px 20px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid var(--border)" }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg, #f5c542, #c49a1a)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Shield size={18} color="#0c0d14" />
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Outfit',sans-serif", color: "var(--accent)" }}>SecOrch</div>
          <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "1px", textTransform: "uppercase" }}>DevSecOps Platform</div>
        </div>
      </div>

      <div style={{ padding: "12px 10px", flex: 1 }}>
        {items.map(item => (
          <button key={item.id} onClick={() => onNav(item.id)} style={{
            display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px",
            borderRadius: 10, border: "none", cursor: "pointer", marginBottom: 2, transition: "all 0.15s",
            background: active === item.id ? "var(--accent-dim)" : "transparent",
            color: active === item.id ? "var(--accent)" : "var(--text-secondary)",
          }}>
            <item.icon size={18} />
            <span style={{ fontSize: 13, fontWeight: active === item.id ? 600 : 400, flex: 1, textAlign: "left" }}>{item.label}</span>
            {item.badge > 0 && <span style={{ background: "var(--red)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 8, minWidth: 18, textAlign: "center" }}>{item.badge}</span>}
          </button>
        ))}
      </div>

      <div style={{ padding: 16, borderTop: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--accent-dim)", border: "1px solid var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "var(--accent)" }}>AM</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600 }}>Amanda Mendes</div>
            <div style={{ fontSize: 10, color: "var(--text-muted)" }}>Head of AppSec</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── DASHBOARD ───
const DashboardPage = ({ onNav }) => {
  const avgScore = (PROJECTS.reduce((s, p) => s + p.score, 0) / PROJECTS.length).toFixed(1);
  const totalVulns = PROJECTS.reduce((s, p) => s + p.vulns.critical + p.vulns.high + p.vulns.medium + p.vulns.low, 0);
  const criticalVulns = PROJECTS.reduce((s, p) => s + p.vulns.critical, 0);
  const fullCoverage = PROJECTS.filter(p => p.coverage === 100).length;
  const radarData = SAMM_DOMAINS.map(d => ({ domain: d.domain, score: d.score, full: 4 }));

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Outfit',sans-serif", marginBottom: 4 }}>Vis\u00e3o Executiva</h1>
        <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>Postura de seguran\u00e7a do portf\u00f3lio &middot; Atualizado em tempo real</p>
      </div>

      <div style={{ display: "flex", gap: 14, marginBottom: 24, flexWrap: "wrap" }}>
        <MetricCard icon={Shield} label="Score m\u00e9dio de maturidade (SAMM)" value={avgScore} sub="+0.3" trend="up" />
        <MetricCard icon={AlertTriangle} label="Vulnerabilidades cr\u00edticas abertas" value={criticalVulns} sub="-3" trend="up" color="var(--red)" />
        <MetricCard icon={Eye} label="Cobertura total de ferramentas" value={`${fullCoverage}/${PROJECTS.length}`} color="var(--green)" />
        <MetricCard icon={Activity} label="Total de vulnerabilidades" value={totalVulns} sub="-45" trend="up" color="var(--orange)" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: 20, animation: "fadeIn 0.5s" }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, fontFamily: "'Outfit',sans-serif" }}>Evolu\u00e7\u00e3o do Score de Maturidade</div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={TREND_DATA}>
              <defs>
                <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f5c542" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f5c542" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: "#5c5d6e", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 4]} tick={{ fill: "#5c5d6e", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#22232e", border: "1px solid rgba(245,197,66,0.15)", borderRadius: 8, fontSize: 12, color: "#f0f0f0" }} />
              <Area type="monotone" dataKey="score" stroke="#f5c542" strokeWidth={2.5} fill="url(#sg)" dot={{ r: 4, fill: "#f5c542", strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: 20, animation: "fadeIn 0.6s" }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, fontFamily: "'Outfit',sans-serif" }}>OWASP SAMM &middot; Portf\u00f3lio</div>
          <ResponsiveContainer width="100%" height={180}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(245,197,66,0.08)" />
              <PolarAngleAxis dataKey="domain" tick={{ fill: "#9a9bae", fontSize: 10 }} />
              <PolarRadiusAxis domain={[0, 4]} tick={false} axisLine={false} />
              <Radar name="Score" dataKey="score" stroke="#f5c542" fill="#f5c542" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: 20, animation: "fadeIn 0.7s" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 700, fontFamily: "'Outfit',sans-serif" }}>Score de Maturidade por Projeto</div>
          <button onClick={() => onNav("projects")} style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", color: "var(--accent)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Ver todos <ChevronRight size={14} /></button>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Projeto", "Time", "Criticidade", "Score", "Cobertura", "Vulns (C/H)", "Tools", "\u00daltimo scan"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 12px", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", borderBottom: "1px solid var(--border)", letterSpacing: "0.5px", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PROJECTS.map(p => (
                <tr key={p.id} style={{ cursor: "pointer" }} onMouseEnter={e => e.currentTarget.style.background = "var(--bg-card-hover)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: 12, fontSize: 13, fontWeight: 600, borderBottom: "1px solid var(--border)" }}><div style={{ display: "flex", alignItems: "center", gap: 8 }}><GitBranch size={14} color="var(--text-muted)" />{p.name}</div></td>
                  <td style={{ padding: 12, fontSize: 12, color: "var(--text-secondary)", borderBottom: "1px solid var(--border)" }}>{p.team}</td>
                  <td style={{ padding: 12, borderBottom: "1px solid var(--border)" }}><CriticalityBadge level={p.criticality} /></td>
                  <td style={{ padding: 12, borderBottom: "1px solid var(--border)" }}><div style={{ display: "flex", alignItems: "center", gap: 8 }}><ScoreBadge score={p.score} />{p.trend === "up" && <TrendingUp size={13} color="var(--green)" />}{p.trend === "down" && <TrendingDown size={13} color="var(--red)" />}</div></td>
                  <td style={{ padding: 12, borderBottom: "1px solid var(--border)", minWidth: 120 }}><CoverageBar pct={p.coverage} /></td>
                  <td style={{ padding: 12, fontSize: 13, borderBottom: "1px solid var(--border)" }}><span style={{ color: p.vulns.critical > 0 ? "var(--red)" : "var(--text-secondary)", fontWeight: p.vulns.critical > 0 ? 700 : 400 }}>{p.vulns.critical}</span><span style={{ color: "var(--text-muted)" }}> / </span><span style={{ color: p.vulns.high > 0 ? "var(--orange)" : "var(--text-secondary)" }}>{p.vulns.high}</span></td>
                  <td style={{ padding: 12, borderBottom: "1px solid var(--border)" }}><div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}><ToolBadge active={p.sast} label="SAST" /><ToolBadge active={p.sca} label="SCA" /><ToolBadge active={p.dast} label="DAST" /><ToolBadge active={p.secrets} label="SEC" /></div></td>
                  <td style={{ padding: 12, fontSize: 12, color: "var(--text-muted)", borderBottom: "1px solid var(--border)" }}><div style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={12} /> {p.lastScan}</div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ─── PROJECTS ───
const ProjectsPage = () => {
  const [selected, setSelected] = useState(null);
  const project = PROJECTS.find(p => p.id === selected);

  if (project) {
    const projectRadar = SAMM_DOMAINS.map(d => ({ domain: d.domain, score: Math.min(4, d.score * (project.score / 2.5)), full: 4 }));
    return (
      <div>
        <button onClick={() => setSelected(null)} style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", color: "var(--accent)", fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 20 }}>&larr; Voltar aos projetos</button>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
          <ScoreBadge score={project.score} size="lg" />
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Outfit',sans-serif" }}>{project.name}</h1>
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 4 }}>
              <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{project.team}</span>
              <CriticalityBadge level={project.criticality} />
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{project.lang}</span>
              {project.compliance.map(c => <span key={c} style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600, background: "var(--accent-dim)", color: "var(--accent)" }}>{c}</span>)}
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, fontFamily: "'Outfit',sans-serif" }}>OWASP SAMM Breakdown</div>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={projectRadar}>
                <PolarGrid stroke="rgba(245,197,66,0.08)" />
                <PolarAngleAxis dataKey="domain" tick={{ fill: "#9a9bae", fontSize: 11 }} />
                <PolarRadiusAxis domain={[0, 4]} tick={false} axisLine={false} />
                <Radar dataKey="score" stroke="#f5c542" fill="#f5c542" fillOpacity={0.15} strokeWidth={2} dot={{ r: 3, fill: "#f5c542" }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, fontFamily: "'Outfit',sans-serif" }}>Vulnerabilidades</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[{ l: "Critical", v: project.vulns.critical, c: "var(--red)" }, { l: "High", v: project.vulns.high, c: "var(--orange)" }, { l: "Medium", v: project.vulns.medium, c: "var(--accent)" }, { l: "Low", v: project.vulns.low, c: "var(--text-secondary)" }].map(x => (
                <div key={x.l} style={{ background: "var(--bg-elevated)", borderRadius: 10, padding: 14, textAlign: "center" }}>
                  <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Outfit',sans-serif", color: x.c }}>{x.v}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{x.l}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8 }}>Cobertura de ferramentas</div>
              <CoverageBar pct={project.coverage} />
            </div>
          </div>
        </div>
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, fontFamily: "'Outfit',sans-serif" }}>Ferramentas integradas</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
            {[{ n: "SAST", a: project.sast, t: "SonarQube" }, { n: "SCA", a: project.sca, t: "Snyk" }, { n: "DAST", a: project.dast, t: "OWASP ZAP" }, { n: "Secrets", a: project.secrets, t: "Gitleaks" }].map(x => (
              <div key={x.n} style={{ background: "var(--bg-elevated)", borderRadius: 10, padding: 14, border: x.a ? "1px solid rgba(52,211,153,0.2)" : "1px solid rgba(248,113,113,0.2)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  {x.a ? <CheckCircle size={16} color="var(--green)" /> : <XCircle size={16} color="var(--red)" />}
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{x.n}</span>
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{x.a ? x.t : "N\u00e3o configurado"}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Outfit',sans-serif", marginBottom: 4 }}>Projetos</h1>
          <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>{PROJECTS.length} projetos monitorados</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 12px" }}>
          <Search size={14} color="var(--text-muted)" />
          <input placeholder="Buscar projeto..." style={{ background: "none", border: "none", outline: "none", color: "var(--text-primary)", fontSize: 12, width: 160, fontFamily: "'DM Sans'" }} />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {PROJECTS.map(p => (
          <div key={p.id} onClick={() => setSelected(p.id)} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: 18, cursor: "pointer", transition: "all 0.15s", animation: "fadeIn 0.4s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border-hover)"; e.currentTarget.style.background = "var(--bg-card-hover)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--bg-card)"; }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{p.name}</div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}><span style={{ fontSize: 11, color: "var(--text-muted)" }}>{p.team}</span><CriticalityBadge level={p.criticality} /></div>
              </div>
              <ScoreBadge score={p.score} />
            </div>
            <CoverageBar pct={p.coverage} />
            <div style={{ display: "flex", gap: 4, marginTop: 12 }}><ToolBadge active={p.sast} label="SAST" /><ToolBadge active={p.sca} label="SCA" /><ToolBadge active={p.dast} label="DAST" /><ToolBadge active={p.secrets} label="SEC" /></div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── INTEGRATIONS ───
const IntegrationsPage = () => (
  <div>
    <div style={{ marginBottom: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Outfit',sans-serif", marginBottom: 4 }}>Integra\u00e7\u00f5es</h1>
      <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>Ferramentas conectadas ao pipeline de seguran\u00e7a</p>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
      {INTEGRATIONS.map(t => (
        <div key={t.name} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: 20, animation: "fadeIn 0.4s" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${t.color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: t.color, fontFamily: "'JetBrains Mono'" }}>{t.icon}</div>
              <div><div style={{ fontSize: 14, fontWeight: 700 }}>{t.name}</div><div style={{ fontSize: 11, color: "var(--text-muted)" }}>{t.type}</div></div>
            </div>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.status === "connected" ? "var(--green)" : "var(--text-muted)", boxShadow: t.status === "connected" ? "0 0 8px var(--green)" : "none" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{t.status === "connected" ? `${t.repos} repos` : t.status === "partial" ? `${t.repos} repos (parcial)` : "Desconectado"}</span>
            <button style={{ background: t.status === "disconnected" ? "var(--accent)" : "var(--bg-elevated)", border: "none", borderRadius: 6, padding: "6px 12px", fontSize: 11, fontWeight: 600, color: t.status === "disconnected" ? "#0c0d14" : "var(--text-secondary)", cursor: "pointer" }}>{t.status === "disconnected" ? "Conectar" : "Configurar"}</button>
          </div>
        </div>
      ))}
      <div style={{ background: "var(--bg-card)", border: "2px dashed var(--border)", borderRadius: 14, padding: 20, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer", minHeight: 130 }}>
        <Plus size={24} color="var(--accent)" /><span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>Adicionar integra\u00e7\u00e3o</span>
      </div>
    </div>
  </div>
);

// ─── ALERTS ───
const AlertsPage = () => {
  const [filter, setFilter] = useState("Todos");
  const filtered = filter === "Todos" ? ALERTS : ALERTS.filter(a => filter === "Gaps" ? a.type === "gap" : filter === "Vulns" ? a.type === "vuln" : a.type === "maturity");
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div><h1 style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Outfit',sans-serif", marginBottom: 4 }}>Alertas</h1><p style={{ fontSize: 13, color: "var(--text-secondary)" }}>Gaps de cobertura e vulnerabilidades priorit\u00e1rias</p></div>
        <div style={{ display: "flex", gap: 6 }}>
          {["Todos", "Gaps", "Vulns", "Maturidade"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid var(--border)", background: f === filter ? "var(--accent-dim)" : "transparent", color: f === filter ? "var(--accent)" : "var(--text-secondary)", fontSize: 12, fontWeight: 500, cursor: "pointer" }}>{f}</button>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map(a => (
          <div key={a.id} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, animation: "fadeIn 0.3s", cursor: "pointer", transition: "all 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-hover)"} onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
            <SeverityBadge severity={a.severity} />
            <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{a.message}</div><div style={{ fontSize: 11, color: "var(--text-muted)" }}><span style={{ fontFamily: "'JetBrains Mono'", color: "var(--accent)" }}>{a.project}</span></div></div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--text-muted)" }}><Clock size={12} /> {a.time}</div>
            <ChevronRight size={16} color="var(--text-muted)" />
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── COMPLIANCE ───
const CompliancePage = () => {
  const frameworks = [
    { name: "PCI DSS v4.x", pct: 72, projects: 2, controls: { met: 46, partial: 12, missing: 6 } },
    { name: "LGPD", pct: 58, projects: 3, controls: { met: 18, partial: 10, missing: 4 } },
    { name: "SOC2 Type II", pct: 35, projects: 2, controls: { met: 17, partial: 15, missing: 16 } },
  ];
  return (
    <div>
      <div style={{ marginBottom: 24 }}><h1 style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Outfit',sans-serif", marginBottom: 4 }}>Compliance</h1><p style={{ fontSize: 13, color: "var(--text-secondary)" }}>Status de conformidade por framework regulat\u00f3rio</p></div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {frameworks.map(fw => (
          <div key={fw.name} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: 24, animation: "fadeIn 0.4s" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
              <div><div style={{ fontSize: 17, fontWeight: 700, fontFamily: "'Outfit',sans-serif", marginBottom: 4 }}>{fw.name}</div><div style={{ fontSize: 12, color: "var(--text-muted)" }}>{fw.projects} projetos afetados</div></div>
              <div style={{ textAlign: "right" }}><div style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Outfit',sans-serif", color: fw.pct >= 70 ? "var(--green)" : fw.pct >= 50 ? "var(--accent)" : "var(--red)" }}>{fw.pct}%</div><div style={{ fontSize: 11, color: "var(--text-muted)" }}>ader\u00eancia</div></div>
            </div>
            <div style={{ height: 8, borderRadius: 4, background: "var(--bg-elevated)", overflow: "hidden", marginBottom: 18 }}>
              <div style={{ height: "100%", width: `${fw.pct}%`, borderRadius: 4, background: fw.pct >= 70 ? "var(--green)" : fw.pct >= 50 ? "var(--accent)" : "var(--red)", transition: "width 0.8s" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              {[{ l: "Atendidos", v: fw.controls.met, c: "var(--green)" }, { l: "Parcial", v: fw.controls.partial, c: "var(--accent)" }, { l: "Pendentes", v: fw.controls.missing, c: "var(--red)" }].map(x => (
                <div key={x.l} style={{ background: "var(--bg-elevated)", borderRadius: 8, padding: 12, textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Outfit',sans-serif", color: x.c }}>{x.v}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{x.l}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── SETTINGS ───
const SettingsPage = () => {
  const [toggles, setToggles] = useState({ gaps: true, block: false, report: true, sync: true });
  return (
    <div>
      <div style={{ marginBottom: 24 }}><h1 style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Outfit',sans-serif", marginBottom: 4 }}>Configura\u00e7\u00f5es</h1><p style={{ fontSize: 13, color: "var(--text-secondary)" }}>Pol\u00edticas de seguran\u00e7a e gates adaptativos</p></div>
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: 24, marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Outfit',sans-serif", marginBottom: 16 }}>Gates Adaptativos por Criticidade</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { level: "Critical", rules: "SAST + SCA + DAST + Secrets obrigat\u00f3rios. Bloqueia critical e high.", score: "M\u00ednimo 3.0" },
            { level: "High", rules: "SAST + SCA + Secrets obrigat\u00f3rios. Bloqueia critical.", score: "M\u00ednimo 2.5" },
            { level: "Medium", rules: "SAST + SCA obrigat\u00f3rios. Alerta em critical.", score: "M\u00ednimo 2.0" },
            { level: "Low", rules: "SAST recomendado. Sem bloqueio.", score: "Sem m\u00ednimo" },
          ].map(g => (
            <div key={g.level} style={{ background: "var(--bg-elevated)", borderRadius: 10, padding: 16, display: "flex", alignItems: "center", gap: 16 }}>
              <CriticalityBadge level={g.level} />
              <div style={{ flex: 1, fontSize: 12, color: "var(--text-secondary)" }}>{g.rules}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--accent)" }}>{g.score}</div>
              <button style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 6, padding: "6px 10px", fontSize: 11, color: "var(--text-secondary)", cursor: "pointer" }}>Editar</button>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
        <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Outfit',sans-serif", marginBottom: 16 }}>Configura\u00e7\u00f5es Gerais</div>
        {[
          { key: "gaps", label: "Notifica\u00e7\u00f5es de gaps de cobertura", desc: "Alertar quando um projeto n\u00e3o tem ferramenta obrigat\u00f3ria" },
          { key: "block", label: "Bloqueio autom\u00e1tico de deploy", desc: "Impedir deploy quando score abaixo do m\u00ednimo" },
          { key: "report", label: "Relat\u00f3rio semanal autom\u00e1tico", desc: "Enviar resumo executivo toda segunda-feira" },
          { key: "sync", label: "Sync cont\u00ednuo de vulnerabilidades", desc: "Atualizar dados das ferramentas a cada 15min" },
        ].map(s => (
          <div key={s.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid var(--border)" }}>
            <div><div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{s.label}</div><div style={{ fontSize: 11, color: "var(--text-muted)" }}>{s.desc}</div></div>
            <div onClick={() => setToggles(prev => ({ ...prev, [s.key]: !prev[s.key] }))} style={{ width: 44, height: 24, borderRadius: 12, background: toggles[s.key] ? "var(--accent)" : "var(--bg-elevated)", cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: toggles[s.key] ? "#0c0d14" : "#fff", position: "absolute", top: 3, left: toggles[s.key] ? 23 : 3, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── APP ───
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
