import { INTEGRATIONS } from "../data/integrations";

export default function Integrations() {
  return (
    <div>
      <h1>Integrations</h1>
      {INTEGRATIONS.map(i => <div key={i.name}>{i.name} - {i.status}</div>)}
    </div>
  );
}
