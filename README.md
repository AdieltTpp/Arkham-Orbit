# Órbita · Prototipo de salud de tripulación

Interfaz React en español, diseñada para tablet y compilada como sitio estático con Vite. Datos y alertas simulados. Modelo anatómico esquemático construido mediante geometría procedural, sin validación anatómica o clínica.

## Ejecutar

Requiere Node.js 20.19+ o 22.12+ y npm. Desde esta carpeta ejecutar `npm ci` y `npm run dev`. Abrir la URL local que muestra Vite.

`npm run build` genera la versión publicable en `dist/`. `npm run preview` permite revisarla localmente. `npm test` comprueba la consistencia de los escenarios simulados. El sitio necesita un servidor HTTP para cargar los módulos. Una página ya cargada conserva sus interacciones locales; no se ha implementado instalación offline mediante service worker.

## Arquitectura

- `src/App.jsx`: estado de la pantalla, escenarios y composición.
- `src/components/`: tarjetas, visor anatómico, panel de detalle y accesos a módulos.
- `src/features/`: diálogo y módulos de juego, cultivo y recuerdos; carga diferida al abrir una actividad.
- `src/data/health.js`: catálogo de indicadores y textos de demostración.
- `src/lib/metrics.js`: transformación de escenarios, sin modificar los datos base.
- `src/lib/storage.js`: lectura y escritura local con manejo de fallos.
- `src/lib/AnatomyViewer.js`: geometría 3D y dibujo bajo demanda, liberación de eventos y observadores al desmontar.
- `src/styles.css` y `src/refinements.css`: estilos base y ajustes de componentes y distribución.
- `tests/metrics.test.js`: regresiones de horario/horas de sueño y restauración de escenarios.
- `dist/`: salida generada, actualizar mediante build.

El visor dibuja solo al iniciar, redimensionar, seleccionar o girar. Agrupa solicitudes en un único requestAnimationFrame y limita la resolución a 1.5 píxeles de dispositivo. React memo evita renders del componente anatómico cuando cambian estados ajenos al visor. No hay bucle de animación, polling, descarga de fuentes ni servicios analíticos. El visor cancela trabajo cuando se oculta la página. El audio sintetizado se detiene al cerrar su ventana o esconder la página. Estas decisiones reducen trabajo continuo; el consumo energético real requiere medición en el dispositivo objetivo. React y React DOM se incluyen en el paquete publicado, sin depender de un CDN.

Los registros de ánimo, juego y cultivo usan localStorage. Los archivos familiares se reproducen mediante URL de objeto y no se suben. La simulación del enlace modifica el estado mostrado; no controla la conexión física. Los escenarios críticos son predefinidos y no implementan reglas clínicas.

No se integran sensores reales, generación audiovisual, prescripción ni videoconferencia en esta demo. Tipografía local Bahnschrift/Segoe UI y monospace para mantener funcionamiento sin descargas.
