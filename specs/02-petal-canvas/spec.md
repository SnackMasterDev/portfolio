# Especificación EARS: Ciclo 02 - Canvas de Pétalos Flotantes

## 1. Alcance
Implementar el motor desacoplado de renderizado de partículas en Canvas 2D (`SakuraCanvas.tsx` y `PetalEngine.ts`) con cálculo estricto de delta-time a 60/120 FPS, oscilación armónica dual y rotación 3D aparente.

---

## 2. Requisitos EARS

- **CUANDO** el componente `<SakuraCanvas />` se monte en la vista:
  - EL SISTEMA debe inicializar un contexto 2D acelerado por hardware sin afectar el ciclo de render de React.
- **MIENTRAS** el bucle de animación esté activo:
  - EL SISTEMA debe actualizar la posición de cada pétalo mediante delta-time normalizado (`dt <= 0.05s`), aplicando oscilación sinusoidal compuesta y escalado en el eje X para simular el giro en tres dimensiones.
- **CUANDO** un pétalo sobrepase la altura de la ventana visible:
  - EL SISTEMA debe reciclar su posición en la parte superior con nuevos parámetros de fase y velocidad para evitar fugas de memoria.
- **SI** la preferencia `prefers-reduced-motion` está activa:
  - EL SISTEMA debe pausar el bucle de física de partículas de forma inmediata.
