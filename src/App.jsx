import { lazy, Suspense, useState } from 'react';
import { healthData } from './data/health.js';
import { readStored, writeStored } from './lib/storage.js';
import { resolveMetric } from './lib/metrics.js';
import AnatomyPanel from './components/AnatomyPanel.jsx';
import MetricCard from './components/MetricCard.jsx';
import DetailPanel from './components/DetailPanel.jsx';
import ModuleCards from './components/ModuleCards.jsx';

const WellnessDialog = lazy(() => import('./features/WellnessDialog.jsx'));
const validMoods = ['Bien', 'Neutral', 'Bajo'];

export default function App() {
  const [selection, setSelection] = useState(null);
  const [scenario, setScenario] = useState('normal');
  const [offline, setOffline] = useState(false);
  const [module, setModule] = useState(null);
  const [mood, setMood] = useState(() => {
    const stored = readStored('orbita-mood', 'Bien');
    return validMoods.includes(stored) ? stored : 'Bien';
  });
  const metrics = healthData.metrics.map(metric => resolveMetric(metric, scenario, mood));
  const metric = metrics.find(item => item.id === selection?.metric);
  const systemId = metric?.system ?? selection?.system ?? null;
  const system = healthData.systems[systemId];
  const critical = scenario === 'critical' && systemId === 'cardio';

  function changeScenario(value) {
    setScenario(value);
    setSelection(value === 'normal' ? null : { metric: value === 'critical' ? 'heart' : 'sleep' });
  }

  function updateMood(value) {
    const saved = writeStored('orbita-mood', value);
    setMood(value);
    return saved;
  }

  return <>
    <a className="skip-link" href="#dashboard">Ir a los indicadores</a>
    <header><a className="brand" href="./">◉ <strong>ÓRBITA</strong><span>CREW HEALTH SYSTEM</span></a><div className="mission">MISIÓN ARES · DÍA 042</div><button className={`connection ${offline ? 'offline' : ''}`} aria-pressed={offline} onClick={() => setOffline(!offline)} title="Simulación del enlace. Las funciones del prototipo se ejecutan localmente.">{offline ? '○ Sin enlace · Modo local' : '● Enlace con Tierra'}</button></header>
    <main id="dashboard">
      <div className="intro"><div><p className="eyebrow">CENTRO DE SALUD PERSONAL</p><h1>Tu salud, en órbita.</h1><p>Comandante Luis Mendoza <span>·</span> Perfil de demostración</p></div><label className="scenario">ESCENARIO SIMULADO<select value={scenario} onChange={event => changeScenario(event.target.value)}><option value="normal">Seguimiento diario</option><option value="attention">Atención · Descanso</option><option value="critical">Alerta cardiovascular</option></select></label></div>
      {scenario === 'critical' && <div className="alert-banner" role="alert"><strong>! Alerta cardiovascular simulada</strong><span>Revisa las lecturas y el panel de seguimiento.</span><button onClick={() => setSelection({ metric: 'heart' })}>Ver alerta →</button></div>}
      <section className="metrics" aria-label="Indicadores de salud">{metrics.map(item => <MetricCard key={item.id} metric={item} selected={metric?.id === item.id} onSelect={() => setSelection({ metric: item.id })} />)}</section>
      <section className={`workspace ${selection ? 'with-detail' : 'without-detail'}`}>
        <aside className="systems"><p className="eyebrow">EXPLORAR SISTEMAS</p><div>{Object.entries(healthData.systems).map(([id, item]) => <button key={id} className={`system ${id === systemId ? 'active' : ''}`} aria-pressed={id === systemId} onClick={() => setSelection({ system: id })}><b aria-hidden="true">{item.symbol}</b>{item.name}</button>)}</div><div className="source-note"><span className="small-dot" /><strong>Datos simulados</strong><p>Las lecturas ilustran el diseño. Sin conexión a sensores clínicos.</p></div></aside>
        <AnatomyPanel system={systemId} critical={critical} title={system?.heading ?? 'Tu cuerpo, conectado.'} expanded={!selection} />
        {selection && <DetailPanel key={`${systemId}-${metric?.id}-${scenario}`} metric={metric} system={system} systemId={systemId} critical={critical} onClose={() => setSelection(null)} onMood={() => setModule('games')} />}
      </section>
      {!selection && <p className="interaction-hint">Selecciona un indicador para explorar su relación con el cuerpo y abrir el seguimiento.</p>}
      <ModuleCards onOpen={setModule} />
      <footer><span>PROTOTIPO UX/UI · ÓRBITA</span><span>Renderizado bajo demanda · Datos guardados en este dispositivo</span></footer>
    </main>
    {module && <Suspense fallback={<div className="loading-message" role="status">Abriendo actividad…</div>}><WellnessDialog module={module} mood={mood} onMoodChange={updateMood} onClose={() => setModule(null)} /></Suspense>}
  </>;
}
