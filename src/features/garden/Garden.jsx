import { useState } from 'react';
import { readStored, writeStored } from '../../lib/storage.js';

export default function Garden() {
  const [activity, setActivity] = useState(() => readStored('orbita-garden', null));
  const [message, setMessage] = useState('');
  function record(action) {
    const next = { action, at: Date.now() };
    if (writeStored('orbita-garden', next)) {
      setActivity(next);
      setMessage(`${action} registrada en este dispositivo.`);
    } else setMessage('No se pudo guardar la actividad. El almacenamiento local no está disponible.');
  }
  return <>
    <p className="eyebrow">AGRICULTURA ESPACIAL</p><h2 id="activity-title">Tu jardín a bordo</h2>
    <div className="garden-summary"><div className="plant" aria-hidden="true"><i /><b /><em /></div><div><strong>Microverdes</strong><p>Bandeja A · Cultivo de demostración</p></div></div>
    <p>Observa el cultivo y registra la tarea realizada según el protocolo de tu misión.</p>
    <div className="choices"><button onClick={() => record('Observación')}>Observé el cultivo</button><button onClick={() => record('Riego')}>Registré el riego</button></div>
    <p>Última actividad<br /><strong>{activity?.action && Number.isFinite(activity.at) ? `${activity.action} · ${new Date(activity.at).toLocaleString('es')}` : 'Sin actividades registradas'}</strong></p>
    <p className="module-status" role="status">{message}</p>
  </>;
}
