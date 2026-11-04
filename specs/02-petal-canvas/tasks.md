# Backlog Atómico: Ciclo 02 - Canvas de Pétalos Flotantes

- [x] **T2.1: Modelar tipos y contratos del motor (`src/engine/types.ts`)**
  - Hecho cuando: Se define la interfaz `Petal` y los contratos de configuración de render.
- [x] **T2.2: Implementar la simulación física matemática (`src/engine/sakura/PetalSimulation.ts`)**
  - Hecho cuando: Las funciones puras calculan la oscilación de vaivén, rotación 3D y avance vertical con delta-time.
- [ ] **T2.3: Crear componente aislado `<SakuraCanvas />` (`src/components/canvas/SakuraCanvas.tsx`)**
  - Hecho cuando: El canvas se monta con `requestAnimationFrame`, limpia buffers y dibuja pétalos a 60/120 FPS sin re-renders de React.
- [ ] **T2.4: Integrar en App.tsx y verificar compilación y FPS**
  - Hecho cuando: `npm run build` pasa limpio y los pétalos caen fluidamente sin tirones.
