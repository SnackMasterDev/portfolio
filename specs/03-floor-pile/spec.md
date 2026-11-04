# Spec 03: Suelo Dinámico y Acumulación Orgánica de Pétalos

## 1. Objetivo
Permitir que los pétalos de cerezo que caen no desaparezcan bruscamente al tocar el fondo, sino que se posen y acumulen de manera natural y orgánica sobre el suelo (#ground / footer), formando un tapiz de sakura que no sobrecargue la memoria.

## 2. Requerimientos Funcionales (EARS)
- **WHEN** un pétalo en caída alcanza el nivel del suelo (`y >= groundY - petal.size`), **THE SYSTEM SHALL** transferir el pétalo al estado de reposo (`isResting = true`), anulando su velocidad y fijando su ángulo de asentamiento horizontal.
- **WHILE** los pétalos descansan en el suelo, **THE SYSTEM SHALL** mantener un búfer circular acotado (máximo 120 pétalos descansando) para evitar fugas de memoria y degradación de FPS.
- **WHEN** el búfer de pétalos descansando supera el límite, **THE SYSTEM SHALL** desvanecer suavemente y reciclar los pétalos más antiguos hacia la copa del árbol.
- **WHEN** se redimensiona la ventana o cambia la altura del documento, **THE SYSTEM SHALL** recalcular la posición de `groundY` adaptándose dinámicamente al footer.

## 3. Criterios de Aceptación
1. `engine/types.ts`: Incorpora `isResting?: boolean`, `restingProgress?: number` y `groundY?: number`.
2. `PetalSimulation.ts`: Función `settlePetal(petal, groundY)` y actualización de resting buffer.
3. Pruebas unitarias al 100% en verde.
