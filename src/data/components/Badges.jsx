export const CriticalityBadge = ({ level }) => {
  const colors = {
    Critical: "red",
    High: "orange",
    Medium: "yellow",
    Low: "cyan"
  };
  return <span style={{ color: colors[level] }}>{level}</span>;
};
