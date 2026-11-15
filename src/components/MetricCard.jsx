export default function MetricCard({ metric, selected, onSelect }) {
  return <button className={`metric ${metric.level} ${selected ? 'selected' : ''}`} onClick={onSelect} aria-pressed={selected} aria-controls="health-detail">
    <span className="metric-label">{metric.name}</span>
    <span className="reading">{metric.value}<small>{metric.unit}</small></span>
    <span className="metric-status">{metric.status}</span>
  </button>;
}
