# Especificación EARS: Ciclo 04 - Puntero Katana y Cinemática de Movimiento

## 1. Alcance
Implementar el cursor personalizado de Katana en `src/components/cursor/` con cinemática física desacoplada: rotación según dirección angular `Math.atan2(dy, dx)`, detección de velocidad vectorial instantánea y ocultamiento suave cuando el puntero sale de la ventana.

---

## 2. Requisitos EARS

- **CUANDO** el puntero del ratón se mueva sobre el viewport:
  - EL SISTEMA debe ocultar el cursor nativo (`cursor-none`) y renderizar la katana SVG en las coordenadas `(x, y)` calculando el ángulo de rotación continuo con interpolación suave (`lerp`).
- **MIENTRAS** el usuario desplace el ratón:
  - EL SISTEMA debe calcular la velocidad escalar en píxeles por segundo: `Math.hypot(vx, vy)`.
- **CUANDO** el cursor abandone la ventana (`mouseleave`):
  - EL SISTEMA debe desvanecer el cursor visual con opacidad 0.
