export default function ModuleCards({ onOpen }) {
  return <section className="modules" aria-label="Actividades de bienestar">
    <button className="module games" onClick={() => onOpen('games')}><div className="module-symbol">✣</div><div><p className="eyebrow">BIENESTAR COGNITIVO</p><h2>Una pausa para ti</h2><p>Juego breve y registro de ánimo</p></div><span>↗</span></button>
    <button className="module family" onClick={() => onOpen('family')}><div className="module-symbol">♫</div><div><p className="eyebrow">CONEXIÓN EMOCIONAL</p><h2>Un poco de casa</h2><p>Mensajes, recuerdos y sonidos</p></div><span>↗</span></button>
    <button className="module garden" onClick={() => onOpen('garden')}><div className="plant" aria-hidden="true"><i /><b /><em /></div><div><p className="eyebrow">AGRICULTURA ESPACIAL</p><h2>Algo bueno crece</h2><p>Microverdes · Bitácora de cuidado</p></div><span>↗</span></button>
  </section>;
}
