# SnackMasterDev — Portfolio de Ingeniería Frontend & Rendimiento Web

<p align="center">
  <img src="public/projects/sakura.png" alt="Sakura Interactive Canvas Preview" width="850" style="border-radius: 16px; border: 1px solid #d6cebf;" />
</p>

<p align="center">
  <strong>Portfolio profesional de Juan Camilo García Gómez (SnackMasterDev)</strong><br />
  Desarrollador Frontend Junior | React 19 · Next.js 16 · TypeScript · Web Performance
</p>

<p align="center">
  <a href="https://github.com/SnackMasterDev"><img src="https://img.shields.io/badge/GitHub-SnackMasterDev-181717?style=flat&logo=github" alt="GitHub" /></a>
  <a href="https://linkedin.com/in/juan-camilo-garcia-"><img src="https://img.shields.io/badge/LinkedIn-Juan_Camilo_García-0A66C2?style=flat&logo=linkedin" alt="LinkedIn" /></a>
  <img src="https://img.shields.io/badge/React-19.0-61DAFB?style=flat&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-6.0-646CFF?style=flat&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/Vitest-139_Tests_Passing-729B1B?style=flat&logo=vitest" alt="Vitest Tests" />
</p>

---

## 🍵 1. Filosofía & Visión Estética
Este portfolio combina la calidez y serenidad del **arte tradicional japonés (Washi, Sumi-e y Kintsugi)** con **estándares rigurosos de ingeniería de software moderna**.

Diseñado para demostrar solvencia técnica ante reclutadores y líderes de ingeniería, prioriza:
* **Rendimiento absoluto a 60/120 FPS:** Animaciones aceleradas por hardware sin *layout thrashing* ni saturación del hilo principal de React.
* **Arquitectura modular limpia (SOLID):** Componentes compactos (<100 líneas), desacoplamiento estricto de capas y separación de responsabilidades (SoC).
* **Internacionalización real (i18n):** Cero Spanglish. 100% Español por defecto y 100% Inglés con alternancia dinámica y persistente.
* **Audio Zen procedural:** Generación de armónicos pentatónicos relajantes mediante la Web Audio API nativa sin archivos pesados de audio.

---

## ⚡ 2. Arquitectura del Sistema

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PORTFOLIO RUNTIME                               │
├───────────────────────────────────┬────────────────────────────────────┤
│         CAPA DE PRESENTACIÓN      │       CAPA DE MOTOR GRÁFICO        │
│          (React 19 + Tailwind)    │           (HTML5 Canvas 2D)        │
├───────────────────────────────────┼────────────────────────────────────┤
│ • Header flotante con i18n & audio│ • SakuraRainEngine (Físicas 2D)    │
│ • Showcase editorial de proyectos │ • rAF loop desacoplado del DOM     │
│ • Timeline de trayectoria laboral │ • Kinemática inversa de Katana     │
│ • Formulario seguro anti-spam     │ • Colisión anti-tunneling (20px)   │
│ • Modal de especificación técnica │ • Procedural Zen Audio Synthesizer │
└───────────────────────────────────┴────────────────────────────────────┘
```

### Principales Decisiones Técnicas (ADRs)
1. **Desacoplamiento del Bucle rAF:** La simulación matemática de pétalos y colisiones corre en un canvas 2D independiente. React jamás gestiona la posición de partículas en estados reactivos (`useState`), erradicando re-renders y garantizando 120 FPS estables.
2. **Kinemática Tangente de la Katana:** El puntero de espada calcula su rotación mediante interpolación suave (*lerp*) y derivadas de movimiento, calculando colisiones contra el tronco mediante muestras a intervalos regulares para prevenir saltos de polígono (*tunneling*).
3. **Internacionalización Desacoplada:** `LanguageContext` reactivo con diccionarios tipados en `translations.ts` y fuentes de datos bilingües (`portfolioData.es.ts` y `portfolioData.en.ts`).

---

## 💼 3. Proyectos Destacados

### 1. [PriceScope](https://github.com/SnackMasterDev) `● En Producción`
* **Descripción:** Dashboard analítico B2B para monitorizar series temporales de inflación real y variaciones cambiarias frente a referencias de divisas.
* **Rol & Logros:** Lideré la arquitectura Frontend en **Next.js 16 (App Router), React 19 y Recharts 3.10**. Elaboré la documentación formal de ingeniería (**especificación SRS, contratos OpenAPI 3.0, modelo relacional PostgreSQL 16 + TimescaleDB y matriz de riesgos**) a partir de las historias de usuario del Product Owner.
* **Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, Recharts, PostgreSQL 16, Docker Compose.

### 2. [ServiceFlow](https://github.com/No-Country-simulation/S08-26-equipo-7) `● Simulación Ágil`
* **Descripción:** Plataforma de mesa de ayuda y gestión de solicitudes TI con trazabilidad de estados en tiempo real y módulo de base de conocimiento.
* **Rol & Logros:** Construcción de interfaz responsiva, filtrado dinámico en memoria con latencias <100ms, integración con endpoints RESTful y flujo de trabajo colaborativo bajo metodología Scrum en No Country.
* **Stack:** React, Vite, Tailwind CSS, shadcn/ui, API REST.

### 3. [Mizu Ecosystem](https://github.com/SnackMasterDev/mizu-ecosystem) `● En Desarrollo · Grado SENA`
* **Descripción:** Plataforma omnicanal integral para cadenas de restaurantes compuesta por 5 aplicaciones (Web cliente, App móvil, POS salón, Escandallo de inventarios y API central).
* **Rol & Logros:** Proyecto de grado para la titulación en Análisis y Desarrollo de Software (SENA ADSO). Lideré la concepción de producto, especificación **IEEE 830 (SRS)**, historias de usuario con criterios de aceptación **BDD (Gherkin)**, modelo de datos relacional y arquitectura de contenedores **C4 Model**.
* **Stack:** TypeScript, React, React Native (Expo), Electron, Node.js, Express, PostgreSQL 16.

### 4. Sakura Interactive Canvas `● Motor Gráfico & UI`
* **Descripción:** Motor de simulación botánica en tiempo real y audio ambiental con interacción física directa integrada en este portfolio.
* **Stack:** HTML5 Canvas, React 19, TypeScript, Web Audio API, Vitest.

---

## 🧪 4. Pruebas y Calidad de Software

El proyecto cuenta con una cobertura integral de pruebas unitarias y de integración ejecutadas con **Vitest**:

```bash
# Ejecutar suite de pruebas completa
npm test -- --run
```

```
Test Files  26 passed (26)
Tests       117 passed (117)
Duration    1.1s
```

* Pruebas de kinemática y colisiones del cursor Katana.
* Pruebas del motor de partículas y aerodinámica de pétalos.
* Pruebas de renderizado y contratos de interfaz de los componentes UI.
* Pruebas del sistema de internacionalización (ES / EN) y persistencia.
* Pruebas de validación del formulario de contacto y protección anti-spam.

---

## 🛠️ 5. Instalación y Ejecución en Local

### Prerrequisitos
* Node.js v18 o superior
* npm v9 o superior

### Pasos
```bash
# 1. Clonar el repositorio
git clone https://github.com/SnackMasterDev/portfolio.git
cd portfolio

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev

# 4. Construir para producción
npm run build

# 5. Previsualizar compilación de producción
npm run preview
```

---

## 📬 6. Contacto

* **Autor:** Juan Camilo García Gómez
* **GitHub:** [@SnackMasterDev](https://github.com/SnackMasterDev)
* **LinkedIn:** [linkedin.com/in/juan-camilo-garcia-](https://linkedin.com/in/juan-camilo-garcia-)
* **Correo:** jcgarcia1565@gmail.com
* **Ubicación:** Lebrija, Santander, Colombia

<p align="center">
  <sub>© 2026 Juan Camilo García Gómez · SnackMasterDev. Interfaces que respiran.</sub>
</p>
