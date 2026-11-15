import { useRef, useState } from 'react';
import { writeStored } from '../../lib/storage.js';

export default function Game({ mood, onMoodChange }) {
  const [game, setGame] = useState(null);
  const [message, setMessage] = useState('');
  const [moodMessage, setMoodMessage] = useState('');
  const started = useRef(0);

  function start() {
    started.current = performance.now();
    setGame({ count: 0, errors: 0, target: Math.floor(Math.random() * 9) });
    setMessage('Actividad en curso');
  }

  function selectCell(index) {
    if (index !== game.target) {
      setGame({ ...game, errors: game.errors + 1 });
      return;
    }
    const count = game.count + 1;
    if (count === 5) {
      const seconds = ((performance.now() - started.current) / 1000).toFixed(1);
      const saved = writeStored('orbita-game', { seconds, errors: game.errors, at: Date.now() });
      setMessage(`5 aciertos · ${game.errors} errores · ${seconds} segundos. ${saved ? 'Resultado guardado.' : 'No se pudo guardar el resultado.'}`);
      setGame(null);
      return;
    }
    const target = (game.target + 1 + Math.floor(Math.random() * 8)) % 9;
    setGame({ ...game, count, target });
  }

  return <>
    <p className="eyebrow">BIENESTAR COGNITIVO</p><h2 id="activity-title">Un momento para ti</h2>
    <p>¿Cómo te sientes hoy?</p>
    <div className="choices" aria-label="Estado de ánimo">{['Bien', 'Neutral', 'Bajo'].map(value => <button key={value} className={value === mood ? 'picked' : ''} aria-pressed={value === mood} onClick={() => setMoodMessage(onMoodChange(value) ? 'Ánimo guardado en este dispositivo.' : 'Ánimo actualizado para esta sesión. No se pudo guardar.')}>{value}</button>)}</div>
    <p role="status">{moodMessage}</p>
    <p>Toca el símbolo iluminado cinco veces. Puedes usar el teclado para recorrer las casillas.</p>
    <button className="action" onClick={start}>{game ? 'Reiniciar actividad' : 'Comenzar actividad'}</button>
    {game && <><p className="game-progress">{game.count} de 5 aciertos · {game.errors} errores</p><div className="game-board">{Array.from({ length: 9 }, (_, index) => <button key={index} className={index === game.target ? 'target' : ''} onClick={() => selectCell(index)} aria-label={`Casilla ${index + 1}${index === game.target ? ', símbolo iluminado' : ', vacía'}`}>{index === game.target ? '✦' : '·'}</button>)}</div></>}
    <p className="module-status" role="status">{message}</p>
    <p className="module-caption">Actividad de demostración. El resultado registra la interacción y carece de interpretación clínica.</p>
  </>;
}
