import { useState } from 'react';
import { appendActivity } from '../lib/storage.js';

export default function DetailPanel({ metric, system, systemId, critical, onClose, onMood }) {
  const [status, setStatus] = useState('');
  function record() {
    if (systemId === 'mood') { onMood(); return; }
    setStatus(appendActivity(systemId) ? 'Actividad registrada en este dispositivo.' : 'No se pudo guardar. El almacenamiento local no está disponible.');
  }
  return <aside id="health-detail" className="detail" aria-label="Detalle de salud">
    <button className="close" onClick={onClose} aria-label="Cerrar detalle">×</button>
    <p className="eyebrow">{metric ? 'INDICADOR' : 'SISTEMA'}</p>
    <h2>{metric?.name ?? system.heading}</h2>
    {metric && <><div className="detail-value">{metric.value} <small>{metric.unit}</small></div><p>{metric.source}<br />Muestra de demostración · 14:32</p></>}
    <p>{metric?.note ?? system.description}</p>
    {critical && <p className="critical-note"><strong>Alerta simulada.</strong> Solicitar apoyo de la tripulación. Procedimiento clínico pendiente de validación.</p>}
    <div className="detail-label">SEGUIMIENTO</div>
    <ul>{system.actions.map(action => <li key={action}>{action}</li>)}</ul>
    <button className="action" onClick={record}>{system.button}</button>
    <p role="status">{status}</p>
  </aside>;
}
