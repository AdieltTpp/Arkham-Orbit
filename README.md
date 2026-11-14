# Órbita · Prototipo de salud de tripulación

Interfaz estática en español, diseñada para tablet. Datos y alertas simulados. Modelo anatómico esquemático construido mediante geometría procedural, sin validación anatómica o clínica.

## Ejecutar

Desde esta carpeta: `python -m http.server 8765 --directory dist`. Abrir http://localhost:8765. También puede abrirse dist/index.html directamente para una demostración sin red.

## Arquitectura

- `dist/index.html`: estructura semántica y regiones de interfaz.
- `dist/styles.css`: colores, componentes y adaptación responsive.
- `dist/data.js`: catálogo de indicadores y contenidos simulados.
- `dist/anatomy.js`: malla 3D procedural, proyección y sombreado mediante Canvas 2D.
- `dist/app.js`: selección, escenarios, diálogos y persistencia local.

El visor dibuja solo al iniciar, redimensionar, seleccionar o girar. Agrupa solicitudes en un único requestAnimationFrame y limita la resolución a 1.5 píxeles de dispositivo. No hay bucle de animación, polling, librerías externas, descarga de fuentes ni servicios analíticos. El audio se detiene al cerrar su ventana o esconder la página. Estas decisiones reducen trabajo continuo; el consumo energético real requiere medición en el dispositivo objetivo.

Los registros de ánimo, juego y cultivo usan localStorage. Los archivos familiares se reproducen mediante URL de objeto y no se suben. La simulación del enlace modifica el estado mostrado; no controla la conexión física. Los escenarios críticos son predefinidos y no implementan reglas clínicas.

No se integran sensores reales, generación audiovisual, prescripción ni videoconferencia en esta demo. Tipografía local Bahnschrift/Segoe UI y monospace para mantener funcionamiento sin descargas.
