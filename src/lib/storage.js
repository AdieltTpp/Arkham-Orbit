export function readStored(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}

export function writeStored(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch { return false; }
}

export function appendActivity(system) {
  const stored = readStored('orbita-records', []);
  const records = Array.isArray(stored) ? stored : [];
  return writeStored('orbita-records', [...records, { system, at: new Date().toISOString() }]);
}
