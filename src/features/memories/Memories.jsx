import { useEffect, useRef, useState } from 'react';

export default function Memories() {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [message, setMessage] = useState('');
  const audio = useRef(null);

  useEffect(() => {
    if (!file) { setUrl(null); return; }
    const source = URL.createObjectURL(file);
    setUrl(source);
    return () => URL.revokeObjectURL(source);
  }, [file]);

  useEffect(() => {
    function pauseHidden() {
      if (!document.hidden) return;
      audio.current?.close();
      audio.current = null;
      setPlaying(false);
    }
    document.addEventListener('visibilitychange', pauseHidden);
    return () => {
      document.removeEventListener('visibilitychange', pauseHidden);
      audio.current?.close();
      audio.current = null;
    };
  }, []);

  async function toggleSound() {
    if (audio.current) {
      await audio.current.close();
      audio.current = null;
      setPlaying(false);
      return;
    }
    try {
      const context = new AudioContext();
      audio.current = context;
      const gain = context.createGain();
      gain.gain.value = 0.025;
      gain.connect(context.destination);
      [174, 261, 348].forEach(frequency => {
        const oscillator = context.createOscillator();
        oscillator.frequency.value = frequency;
        oscillator.connect(gain);
        oscillator.start();
      });
      await context.resume();
      if (audio.current === context) setPlaying(true);
    } catch {
      audio.current?.close();
      audio.current = null;
      setMessage('El navegador no pudo iniciar el audio.');
    }
  }

  function chooseFile(event) {
    const selected = event.target.files?.[0];
    if (!selected) return;
    if (!/^(image|audio|video)\//.test(selected.type)) {
      setMessage('Elige una imagen, un audio o un video compatible.');
      return;
    }
    setFile(selected);
    setMessage('Archivo abierto en este dispositivo.');
  }

  return <>
    <p className="eyebrow">CONEXIÓN EMOCIONAL</p><h2 id="activity-title">Un poco de casa</h2>
    <p>Abre una foto, un audio o un video de tu dispositivo. El archivo permanece en tu equipo.</p>
    <label className="file-label">Elegir un recuerdo<input type="file" accept="image/*,audio/*,video/*" onChange={chooseFile} /></label>
    <div className="memory-preview">{url && file?.type.startsWith('image/') && <img src={url} alt="Recuerdo seleccionado" />}{url && file?.type.startsWith('video/') && <video src={url} controls preload="metadata" />}{url && file?.type.startsWith('audio/') && <audio src={url} controls preload="metadata" />}</div>
    <p className="module-caption">Los mensajes generativos requieren autorización familiar y una etiqueta visible. Esta demo reproduce archivos locales.</p>
    <button className="action" onClick={toggleSound}>{playing ? 'Detener sonido' : 'Reproducir sonido suave'}</button>
    <p className="module-status" role="status">{message}</p>
  </>;
}
