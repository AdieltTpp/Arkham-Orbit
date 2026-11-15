import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveMetric } from '../src/lib/metrics.js';
import { healthData } from '../src/data/health.js';

test('El escenario de descanso mantiene coherencia entre valor y horario', () => {
  const original = healthData.metrics.find(metric => metric.id === 'sleep');
  const resolved = resolveMetric(original, 'attention', 'Bien');
  assert.equal(resolved.value, '4.5');
  assert.match(resolved.note, /02:00 a 06:30/);
  assert.equal(original.value, '7.5');
});

test('Restaurar el escenario diario elimina los estados críticos', () => {
  for (const metric of healthData.metrics) {
    const resolved = resolveMetric(metric, 'normal', 'Neutral');
    assert.equal(resolved.level, '');
    assert.equal(resolved.value, metric.id === 'mood' ? 'Neutral' : metric.value);
  }
});

test('Solo las dos lecturas cardiovasculares cambian en el escenario crítico', () => {
  const critical = healthData.metrics.map(metric => resolveMetric(metric, 'critical', 'Bien'));
  assert.deepEqual(critical.filter(metric => metric.level === 'critical').map(metric => metric.id), ['pressure', 'heart']);
});
