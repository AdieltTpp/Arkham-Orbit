export function resolveMetric(metric, scenario, mood) {
  const result = { ...metric, status: 'Muestra de demo', level: '' };
  if (scenario === 'attention' && metric.id === 'sleep') {
    Object.assign(result, { value: '4.5', status: '△ Revisar descanso', level: 'warning', note: 'Horario simulado de 02:00 a 06:30. Revisa el registro de descanso.' });
  }
  if (scenario === 'critical' && ['heart', 'pressure'].includes(metric.id)) {
    Object.assign(result, { value: metric.id === 'heart' ? '142' : '160/100', status: '! Escenario crítico', level: 'critical' });
  }
  if (metric.id === 'mood') result.value = mood;
  return result;
}
