# Spec 05: Ventarrón Caótico al Cortar ("Wind Slash")

## 1. Objetivo
Dotar a la Katana de un efecto aerodinámico cinemático ("Wind Slash"): cuando el usuario realiza un corte o movimiento rápido con la espada, se genera una onda expansiva de viento direccional que dispersa caóticamente los pétalos cercanos en el aire.

## 2. Requerimientos Funcionales (EARS)
- **WHEN** la velocidad del cursor katana supera el umbral de corte rápido (`speed > 800 px/s`), **THE SYSTEM SHALL** emitir un evento cinemático `katana-slash` con coordenadas `(x, y)`, ángulo del corte y magnitud del vector de velocidad.
- **WHEN** se detecta un `katana-slash`, **THE SYSTEM SHALL** calcular la distancia de cada pétalo flotante respecto a la hoja de la katana.
- **IF** el pétalo se encuentra dentro del radio de influencia del corte (`dist < 180 px`), **THEN** **THE SYSTEM SHALL** aplicar un impulso vectorial en la dirección del tajo (`angle`), incrementando la velocidad angular y el volteo 3D caótico.
- **WHILE** el impulso está activo, el pétalo amortigua el exceso de velocidad progresivamente hasta recuperar la velocidad terminal de caída suave.

## 3. Criterios de Aceptación
1. Detección de umbral `speed > 800 px/s` en `useKatanaMotion.ts`.
2. Reacción reactiva de los pétalos en `PetalSimulation.ts` / `useSakuraAnimation.ts` mediante `applyWindSlash(petals, slashOrigin, slashAngle, strength)`.
3. Pruebas unitarias al 100% en verde.
