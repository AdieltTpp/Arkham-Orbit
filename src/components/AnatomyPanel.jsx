import { memo, useEffect, useRef } from 'react';
import { AnatomyViewer } from '../lib/AnatomyViewer.js';

export default memo(function AnatomyPanel({ system, critical, title, expanded }) {
  const canvas = useRef(null);
  const viewer = useRef(null);

  useEffect(() => {
    viewer.current = new AnatomyViewer(canvas.current);
    return () => { viewer.current.dispose(); viewer.current = null; };
  }, []);

  useEffect(() => { viewer.current.select(system, critical); }, [system, critical]);

  function rotate(direction) {
    viewer.current.angle += direction * Math.PI / 8;
    viewer.current.requestDraw();
  }

  return <section className={`anatomy ${expanded ? 'expanded' : ''}`} aria-label="Explorador anatómico">
    <div className="viewer-heading">
      <div><p className="eyebrow">VISTA ANATÓMICA</p><h2>{title}</h2></div>
      <span className="viewer-tag">3D · LOCAL</span>
    </div>
    <canvas ref={canvas} tabIndex={0} aria-label="Modelo anatómico esquemático 3D. Arrastra para girar o usa las flechas del teclado." />
    <div className="viewer-bottom">
      <span>↔ Arrastra para explorar</span>
      <div className="rotation-controls">
        <button onClick={() => rotate(-1)} aria-label="Girar cuerpo a la izquierda">←</button>
        <button onClick={() => { viewer.current.angle = 0; viewer.current.requestDraw(); }}>↺ Frontal</button>
        <button onClick={() => rotate(1)} aria-label="Girar cuerpo a la derecha">→</button>
      </div>
    </div>
    <div className="axis">MODELO ESQUEMÁTICO</div>
  </section>;
});
