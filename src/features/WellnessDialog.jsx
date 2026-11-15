import { useEffect, useRef } from 'react';
import Game from './game/Game.jsx';
import Garden from './garden/Garden.jsx';
import Memories from './memories/Memories.jsx';

export default function WellnessDialog({ module, mood, onMoodChange, onClose }) {
  const dialog = useRef(null);
  useEffect(() => {
    const element = dialog.current;
    const previousFocus = document.activeElement;
    element.showModal();
    return () => {
      element.close();
      previousFocus?.focus();
    };
  }, []);

  return <dialog ref={dialog} aria-labelledby="activity-title" onCancel={event => { event.preventDefault(); onClose(); }}>
    <button className="close" onClick={onClose} aria-label="Cerrar actividad">×</button>
    {module === 'games' && <Game mood={mood} onMoodChange={onMoodChange} />}
    {module === 'garden' && <Garden />}
    {module === 'family' && <Memories />}
  </dialog>;
}
