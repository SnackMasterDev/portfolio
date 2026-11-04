# Especificación EARS: Ciclo 08 - UI Showcase y Secciones de Portafolio

## 1. Alcance
Implementar el modelo de datos estructurado en `src/data/portfolioData.ts` y las secciones modulares de presentación en `src/components/sections/` (`HeroSection.tsx`, `ProjectsSection.tsx`, `ExperienceSection.tsx`) respetando el límite estricto de <100 líneas por componente.

---

## 2. Requisitos EARS

- **CUANDO** el usuario visualice la interfaz:
  - EL SISTEMA debe presentar la identidad de Juan Camilo García (`SnackMasterDev`), descripción de rol (Creative Frontend & Systems Engineer), botones de llamada a la acción y tarjetas bento de proyectos destacados con tecnologías y métricas.
- **MIENTRAS** la página se renderice:
  - CADA componente visual debe mantenerse por debajo de 100 líneas, delegando los datos estáticos al archivo `portfolioData.ts`.
