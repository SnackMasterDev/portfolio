# Especificación EARS: Ciclo 01 - Scaffolding Limpio & Arneses Base

## 1. Alcance Exclusivo de este Ciclo
Inicializar la estructura del proyecto en Vite + React 18/19 + TypeScript y Tailwind CSS, preservando los archivos de configuración (`AGENTS.md`, `.devbrain.json`, `docs/constitution.md`, `.agents/`), importando el asset gráfico y configurando el control de versiones con Git.

---

## 2. Requisitos en Notación EARS

- **CUANDO** el proyecto se compile con `npm run build`:
  - EL SISTEMA debe generar la carpeta `dist/` sin ningún error de TypeScript (`tsc -b`) ni advertencias de linting.
- **CUANDO** se inspeccione la carpeta `public/assets/`:
  - EL SISTEMA debe contener la imagen `imagen-fondo.webp` lista para ser servida estáticamente.
- **CUANDO** se verifique el estado del repositorio con `git status`:
  - EL SISTEMA debe ignorar `node_modules/`, `dist/`, `.env*` y registrar un commit semántico limpio: `chore: initial scaffolding with vite, react, ts and tailwind`.
