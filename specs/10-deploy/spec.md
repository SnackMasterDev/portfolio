# Spec 10: Auditoría Hostil The-Critic, GitHub Push y Despliegue en Vercel

## 1. Objetivo
Asegurar que el portfolio cumpla con el estándar institucional de cero errores, rendimiento a 60/120 FPS, arquitectura modular (<100 líneas por componente visual, <250 líneas por servicio) y esté listo para producción en Vercel con su repositorio público en GitHub sincronizado.

## 2. Requerimientos de Auditoría (The Critic)
- **Rendimiento:** Animaciones exclusivamente en propiedades compuestas por GPU (`transform`, `opacity`), sin re-renders en React inducidos por partículas (`requestAnimationFrame` desacoplado de `useState`).
- **Accesibilidad y Supresión:** Todos los punteros nativos ocultos mediante `cursor: none !important;` en elementos interactivos; soporte para teclado y navegación accesible.
- **Tipado Estricto:** Cero `any` comodines; `tsc -b` y Vitest ejecutados con 100% de éxito.
- **Configuración de Despliegue:** `vercel.json` configurado para Vite (`buildCommand: "npm run build"`, `outputDirectory: "dist"`).

## 3. Criterios de Aceptación
1. 100% de suites de pruebas pasando en Vitest (64/64 pruebas unitarias).
2. Build de producción `npm run build` sin errores en menos de 250ms.
3. Código sincronizado con `origin/main` en [github.com/SnackMasterDev/portfolio](https://github.com/SnackMasterDev/portfolio).
