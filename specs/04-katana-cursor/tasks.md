# Backlog Atómico: Ciclo 04 - Puntero Katana

- [x] **T4.1: Crear useKatanaMotion y componente KatanaCursor**
  - Hecho cuando: `src/components/cursor/KatanaCursor.tsx` (<80 líneas) renderiza la espada SVG rotando dinámicamente y calculando velocidad.
- [x] **T4.2: Tests y verificación de cinemática**
  - Hecho cuando: Las pruebas unitarias verifican cálculo de ángulos y velocidad sin errores de build.
- [x] **T4.3: Ajustes de calidad y accesibilidad (Ciclo 04 Review)**
  - Hecho cuando: useKatanaMotion maneja `cursor-none` en `document.body`, sincroniza con `requestAnimationFrame` contra re-renderizados a 1000Hz, y respeta `prefers-reduced-motion` omitiendo rotaciones dinámicas.
