import { ALERTS } from "../data/alerts";

export default function Alerts() {
  return (
    <div>
      <h1>Alerts</h1>
      {ALERTS.map(a => <div key={a.id}>{a.message}</div>)}
    </div>
  );
}
