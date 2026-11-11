const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

function getCvHtml(lang) {
  const isEs = lang === 'es';

  return `<!DOCTYPE html>
<html lang="${isEs ? 'es' : 'en'}">
<head>
<meta charset="UTF-8">
<title>${isEs ? 'CV - Juan Camilo García' : 'Resume - Juan Camilo Garcia'}</title>
<style>
  @page {
    size: A4 portrait;
    margin: 13mm 16mm 13mm 16mm;
  }
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  html, body {
    width: 100%;
    background-color: #ffffff;
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #1e293b;
    font-size: 9.3pt;
    line-height: 1.48;
    -webkit-font-smoothing: antialiased;
  }
  a {
    color: #1d4ed8;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }

  /* Header */
  .header {
    text-align: center;
    margin-bottom: 12px;
    padding-bottom: 10px;
    border-bottom: 2px solid #0f172a;
  }
  .header-name {
    font-size: 23pt;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.02em;
    line-height: 1.15;
    margin-bottom: 3px;
  }
  .header-title {
    font-size: 11pt;
    font-weight: 700;
    color: #1d4ed8;
    margin-bottom: 6px;
    letter-spacing: 0.01em;
  }
  .header-contact {
    font-size: 8.8pt;
    color: #475569;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 6px 10px;
    line-height: 1.3;
  }
  .dot {
    color: #94a3b8;
    font-weight: bold;
  }

  /* Summary */
  .summary {
    font-size: 9.3pt;
    color: #334155;
    line-height: 1.5;
    margin-bottom: 14px;
    text-align: justify;
  }

  /* Section */
  .section {
    margin-bottom: 14px;
  }
  .section-title {
    font-size: 10.5pt;
    font-weight: 800;
    color: #0f172a;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding-bottom: 3px;
    border-bottom: 1.5px solid #cbd5e1;
    margin-bottom: 9px;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    white-space: nowrap;
  }
  .section-tagline {
    font-size: 8pt;
    font-weight: normal;
    text-transform: none;
    color: #64748b;
  }

  /* Items */
  .item {
    margin-bottom: 11px;
  }
  .item:last-child {
    margin-bottom: 0;
  }
  .item-top {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 2px;
  }
  .item-name {
    font-size: 10pt;
    font-weight: 700;
    color: #0f172a;
  }
  .item-company {
    font-size: 9.8pt;
    font-weight: 600;
    color: #1d4ed8;
  }
  .item-badge {
    font-size: 7.8pt;
    font-weight: 600;
    color: #475569;
    background: #f1f5f9;
    padding: 1.5px 5.5px;
    border-radius: 4px;
    border: 1px solid #e2e8f0;
    margin-left: 6px;
    vertical-align: middle;
  }
  .item-date {
    font-size: 8.8pt;
    font-weight: 600;
    color: #64748b;
    white-space: nowrap;
  }
  .item-meta {
    font-size: 8.8pt;
    color: #475569;
    margin-bottom: 3px;
    line-height: 1.38;
  }
  .item-meta strong {
    color: #1e293b;
  }

  /* Bullets */
  ul.bullets {
    list-style: none;
    padding-left: 0;
    margin-top: 2px;
  }
  ul.bullets li {
    position: relative;
    padding-left: 13px;
    font-size: 9pt;
    color: #334155;
    line-height: 1.45;
    margin-bottom: 3px;
  }
  ul.bullets li:last-child {
    margin-bottom: 0;
  }
  ul.bullets li::before {
    content: "•";
    position: absolute;
    left: 2px;
    color: #1d4ed8;
    font-weight: bold;
    font-size: 9.5pt;
  }
  ul.bullets li strong {
    color: #0f172a;
    font-weight: 600;
  }

  /* Skills */
  .skills-grid {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 9pt;
  }
  .skill-row {
    display: flex;
    line-height: 1.38;
  }
  .skill-category {
    width: 170px;
    font-weight: 700;
    color: #0f172a;
    flex-shrink: 0;
  }
  .skill-list {
    color: #334155;
  }

  /* Page break */
  .page-break {
    page-break-before: always;
    break-before: page;
  }

  @media print {
    body {
      background: none;
    }
    .page-break {
      page-break-before: always;
      break-before: page;
    }
  }
</style>
</head>
<body>

  <!-- ==================== PÁGINA 1 ==================== -->

  <!-- HEADER -->
  <header class="header">
    <h1 class="header-name">Juan Camilo García</h1>
    <div class="header-title">${isEs ? 'Desarrollador Full Stack & Arquitecto de Software' : 'Full Stack Developer & Software Architect'}</div>
    <div class="header-contact">
      <span>Lebrija, Santander, Colombia</span>
      <span class="dot">•</span>
      <span><a href="mailto:juancamilo.garcia.dev@gmail.com">juancamilo.garcia.dev@gmail.com</a></span>
      <span class="dot">•</span>
      <span><a href="https://linkedin.com/in/juan-camilo-garcia-" target="_blank">linkedin.com/in/juan-camilo-garcia-</a></span>
      <span class="dot">•</span>
      <span><a href="https://github.com/SnackMasterDev" target="_blank">github.com/SnackMasterDev</a></span>
      <span class="dot">•</span>
      <span><a href="https://portfolio-snackmaster.vercel.app" target="_blank">portfolio-snackmaster.vercel.app</a></span>
    </div>
  </header>

  <!-- RESUMEN PROFESIONAL -->
  <section class="summary">
    ${isEs
      ? '<strong>Desarrollador de Software y Tecnólogo en ADSO (SENA)</strong> con amplia trayectoria en simulaciones laborales aceleradas y proyectos de alto impacto. Especializado en el ecosistema <strong>TypeScript, React, Node.js y bases de datos relacionales / time-series (PostgreSQL, TimescaleDB)</strong>. Experiencia demostrada asumiendo roles de liderazgo técnico de frontend, diseño de sistemas, modelado relacional y autoría formal de especificaciones de ingeniería (SRS IEEE 830, contratos OpenAPI 3.0). Enfoque riguroso en Clean Architecture, SOLID, código limpio y rendimiento medible.'
      : '<strong>Software Developer and ADSO Technologist (SENA)</strong> with substantial track record across accelerated agile work simulations and high-impact engineering projects. Specialized in the <strong>TypeScript, React, Node.js, and relational / time-series databases (PostgreSQL, TimescaleDB)</strong> ecosystem. Proven experience taking on frontend technical leadership, system architecture, relational modeling, and authoring formal engineering specifications (SRS under IEEE 830, OpenAPI 3.0 contracts). Committed to Clean Architecture, SOLID, clean code, and measurable performance.'}
  </section>

  <!-- PROYECTOS DESTACADOS DE INGENIERÍA -->
  <section class="section">
    <h2 class="section-title">
      <span>${isEs ? 'Proyectos Destacados de Ingeniería' : 'Key Engineering Projects'}</span>
      <span class="section-tagline">${isEs ? 'Arquitectura · Código · Despliegues' : 'Architecture · Code · Deployments'}</span>
    </h2>

    <!-- PROYECTO 1: PriceScope -->
    <div class="item">
      <div class="item-top">
        <div>
          <span class="item-name">PriceScope</span>
          <span class="item-badge">${isEs ? 'Monitoreo Macroeconómico B2B' : 'B2B Macroeconomic Monitor'}</span>
        </div>
        <div class="item-date">${isEs ? 'En Producción · 2026' : 'In Production · 2026'}</div>
      </div>
      <div class="item-meta">
        <strong>${isEs ? 'Rol:' : 'Role:'}</strong> ${isEs ? 'Líder Técnico Frontend & Diseñador de Sistema' : 'Frontend Tech Lead & System Designer'} | 
        <strong>${isEs ? 'Despliegue en Vivo:' : 'Live Deployment:'}</strong> <a href="https://pricescope-frontend.vercel.app" target="_blank">pricescope-frontend.vercel.app</a> | 
        <strong>GitHub:</strong> <a href="https://github.com/No-Country-simulation/S10-26-EQUIPO-2-PriceScope" target="_blank">No-Country-simulation/S10-26-EQUIPO-2-PriceScope</a>
      </div>
      <ul class="bullets">
        <li>${isEs 
          ? '<strong>Ingeniería y Documentación Formal:</strong> Autoría integral del documento de Especificación de Requerimientos de Software (SRS bajo estándar IEEE 830) derivado de historias de usuario y diseño de especificación OpenAPI 3.0 para microservicios de ingesta.' 
          : '<strong>Engineering & Formal Specs:</strong> Authored full Software Requirements Specification (SRS under IEEE 830) derived from business user stories and designed OpenAPI 3.0 contracts for ingestion microservices.'}</li>
        <li>${isEs 
          ? '<strong>Persistencia Relacional y Dashboard en Vivo:</strong> Arquitectura de base de datos en <strong>PostgreSQL 16 con TimescaleDB</strong> para ingesta y compresión de series temporales de inflación minorista, y desarrollo del dashboard analítico en React + TypeScript desplegado en Vercel.' 
          : '<strong>Relational Persistence & Live Dashboard:</strong> Engineered relational database architecture in <strong>PostgreSQL 16 + TimescaleDB</strong> for retail inflation time-series, and delivered real-time analytics dashboard in React + TypeScript deployed on Vercel.'}</li>
      </ul>
    </div>

    <!-- PROYECTO 2: ServiceFlow -->
    <div class="item">
      <div class="item-top">
        <div>
          <span class="item-name">ServiceFlow</span>
          <span class="item-badge">${isEs ? 'Mesa de Ayuda B2B & SLAs' : 'B2B Helpdesk & SLA Management'}</span>
        </div>
        <div class="item-date">2026</div>
      </div>
      <div class="item-meta">
        <strong>${isEs ? 'Rol:' : 'Role:'}</strong> ${isEs ? 'Desarrollador Frontend & Diseñador UI/UX' : 'Frontend Developer & UI/UX Designer'} | 
        <strong>Demo:</strong> <a href="https://s08-26-equipo-7.vercel.app" target="_blank">s08-26-equipo-7.vercel.app</a> | 
        <strong>GitHub:</strong> <a href="https://github.com/No-Country-simulation/S08-26-equipo-7" target="_blank">No-Country-simulation/S08-26-equipo-7</a>
      </div>
      <ul class="bullets">
        <li>${isEs 
          ? '<strong>Motor de Tickets y Semáforo de SLAs:</strong> Plataforma corporativa de gestión de solicitudes internas con temporizadores reactivos, semáforo de cumplimiento de SLAs corporativos y flujo de aprobaciones.' 
          : '<strong>Ticketing Engine & SLA Timers:</strong> Corporate helpdesk platform with reactive SLA countdown timers, visual status tracking, and multi-tier approval workflows.'}</li>
        <li>${isEs 
          ? '<strong>Stack Tecnológico:</strong> Construido con React 19, TypeScript, Tailwind CSS, componentes de shadcn/ui y arquitectura desacoplada por hooks y servicios puros.' 
          : '<strong>Tech Stack:</strong> Built with React 19, TypeScript, Tailwind CSS, shadcn/ui components, and clean decoupled services and custom hooks.'}</li>
      </ul>
    </div>

    <!-- PROYECTO 3: Mizu Ecosystem -->
    <div class="item">
      <div class="item-top">
        <div>
          <span class="item-name">Mizu Ecosystem</span>
          <span class="item-badge">${isEs ? 'Proyecto de Grado SENA' : 'SENA Capstone Project'}</span>
        </div>
        <div class="item-date">${isEs ? 'En Desarrollo · 2026' : 'In Development · 2026'}</div>
      </div>
      <div class="item-meta">
        <strong>${isEs ? 'Rol:' : 'Role:'}</strong> ${isEs ? 'Arquitecto de Software Principal' : 'Lead Software Architect'} | 
        <strong>GitHub:</strong> <a href="https://github.com/SnackMasterDev/mizu-ecosystem" target="_blank">github.com/SnackMasterDev/mizu-ecosystem</a>
      </div>
      <ul class="bullets">
        <li>${isEs 
          ? '<strong>Arquitectura Empresarial y Modelo C4:</strong> Diseño arquitectónico de suite modular de 5 aplicaciones para gestión gastronómica y recursos hídricos con microservicios en Go/Node.js, PostgreSQL/TimescaleDB y telemetría.' 
          : '<strong>Enterprise Architecture & C4 Model:</strong> Multi-tiered architectural design for a 5-app restaurant and water management suite with Go/Node.js microservices, PostgreSQL/TimescaleDB, and telemetry.'}</li>
        <li>${isEs 
          ? '<strong>Estándares de Ingeniería:</strong> Especificaciones IEEE 830, criterios de aceptación BDD (Gherkin), diagramas de clases UML y contratos de interfaz validados documentalmente.' 
          : '<strong>Engineering Standards:</strong> Complete IEEE 830 SRS specs, BDD acceptance criteria (Gherkin), UML class diagrams, and interface contracts systematically documented.'}</li>
      </ul>
    </div>

    <!-- PROYECTO 4: ReservApp -->
    <div class="item">
      <div class="item-top">
        <div>
          <span class="item-name">ReservApp</span>
          <span class="item-badge">${isEs ? 'Reservas & Disponibilidad Gastronómica' : 'Restaurant Booking & Availability'}</span>
        </div>
        <div class="item-date">2024</div>
      </div>
      <div class="item-meta">
        <strong>${isEs ? 'Rol:' : 'Role:'}</strong> ${isEs ? 'Desarrollador Full Stack' : 'Full Stack Developer'} | 
        <strong>Demo:</strong> <a href="https://develop--reserv-app.netlify.app" target="_blank">develop--reserv-app.netlify.app</a> | 
        <strong>GitHub:</strong> <a href="https://github.com/No-Country-simulation/s16-05-m-php-react" target="_blank">No-Country-simulation/s16-05-m-php-react</a>
      </div>
      <ul class="bullets">
        <li>${isEs 
          ? '<strong>Mapeo Dinámico y Disponibilidad en Tiempo Real:</strong> Simulación de distribución espacial de mesas en matriz 2D con cálculo reactivo de asientos y sincronización optimista con backend REST.' 
          : '<strong>Dynamic Layout & Real-time Availability:</strong> Interactive 2D floor table map with reactive seat computation and optimistic UI synchronization with REST backend.'}</li>
        <li>${isEs 
          ? '<strong>Metodología Ágil:</strong> Trabajo en célula Scrum interdisciplinaria con integración continua y entregas incrementales en sprints de dos semanas.' 
          : '<strong>Agile Methodology:</strong> Cross-functional Scrum squad collaboration with continuous integration and incremental 2-week sprint deliverables.'}</li>
      </ul>
    </div>
  </section>

  <!-- ==================== PÁGINA 2 ==================== -->
  <div class="page-break"></div>

  <!-- EXPERIENCIA LABORAL & SIMULACIONES ÁGILES -->
  <section class="section" style="margin-top: 4px;">
    <h2 class="section-title">
      <span>${isEs ? 'Experiencia Laboral & Simulaciones Ágiles' : 'Work Experience & Agile Simulations'}</span>
      <span class="section-tagline">${isEs ? 'Simulaciones Scrum & Producción' : 'Scrum Simulations & Production'}</span>
    </h2>

    <!-- SIMULACIÓN 1: PriceScope (No Country) -->
    <div class="item">
      <div class="item-top">
        <div>
          <span class="item-name">${isEs ? 'Líder Técnico Frontend & Diseñador UX/UI' : 'Frontend Tech Lead & UX/UI Designer'}</span>
          <span class="item-company">· No Country</span>
          <span class="item-badge">${isEs ? 'Simulación Ágil · PriceScope' : 'Agile Simulation · PriceScope'}</span>
        </div>
        <div class="item-date">10/2026 — 11/2026</div>
      </div>
      <div class="item-meta">${isEs ? 'Célula de Desarrollo Ágil · Remoto' : 'Agile Development Squad · Remote'}</div>
      <ul class="bullets">
        <li>${isEs 
          ? 'Liderazgo técnico en la arquitectura de interfaz con Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Recharts y primitivos de Radix UI.' 
          : 'Technical interface architecture leadership with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Recharts, and Radix UI.'}</li>
        <li>${isEs 
          ? 'Configuración del entorno de persistencia y análisis de datos en PostgreSQL 16 + TimescaleDB utilizando Docker Compose.' 
          : 'Data environment and persistence configuration on PostgreSQL 16 + TimescaleDB using Docker Compose.'}</li>
        <li>${isEs 
          ? 'Co-elaboración de la documentación formal de ingeniería (SRS, OpenAPI 3.0, modelo relacional y matriz de riesgos).' 
          : 'Co-authored formal engineering documentation (SRS, OpenAPI 3.0, relational database schema, and risk matrix).'}</li>
      </ul>
    </div>

    <!-- SIMULACIÓN 2: ServiceFlow (No Country) -->
    <div class="item">
      <div class="item-top">
        <div>
          <span class="item-name">${isEs ? 'Desarrollador Frontend' : 'Frontend Developer'}</span>
          <span class="item-company">· No Country</span>
          <span class="item-badge">${isEs ? 'Simulación Ágil · ServiceFlow' : 'Agile Simulation · ServiceFlow'}</span>
        </div>
        <div class="item-date">10/2026</div>
      </div>
      <div class="item-meta">${isEs ? 'Célula de Desarrollo Ágil · Remoto' : 'Agile Development Squad · Remote'}</div>
      <ul class="bullets">
        <li>${isEs 
          ? 'Desarrollo colaborativo en células de trabajo bajo metodología Scrum con sprints, entregas continuas y revisiones de código (PRs) en equipo multidisciplinar.' 
          : 'Collaborative development in agile Scrum squads with biweekly sprints, continuous integration, and peer pull request reviews.'}</li>
        <li>${isEs 
          ? 'Construcción modular de la interfaz de usuario con React, Vite, Tailwind CSS y componentes de shadcn/ui con tipado estricto en TypeScript.' 
          : 'Modular UI construction with React, Vite, Tailwind CSS, and shadcn/ui components with strict TypeScript typing.'}</li>
        <li>${isEs 
          ? 'Integración con endpoints de API REST para seguimiento de tickets en tiempo real y trazabilidad de responsables.' 
          : 'Integration with REST API endpoints for real-time ticket state tracking and assignee accountability.'}</li>
      </ul>
    </div>

    <!-- SIMULACIÓN 3: ReservApp (No Country) -->
    <div class="item">
      <div class="item-top">
        <div>
          <span class="item-name">${isEs ? 'Desarrollador Full Stack' : 'Full Stack Developer'}</span>
          <span class="item-company">· No Country</span>
          <span class="item-badge">${isEs ? 'Simulación Ágil · ReservApp' : 'Agile Simulation · ReservApp'}</span>
        </div>
        <div class="item-date">07/2024 — 08/2024</div>
      </div>
      <div class="item-meta">${isEs ? 'Célula de Desarrollo Ágil · Remoto' : 'Agile Development Squad · Remote'}</div>
      <ul class="bullets">
        <li>${isEs 
          ? 'Construcción de componentes interactivos en React para visualización en tiempo real de disponibilidad y reservas de mesas en restaurantes.' 
          : 'Built interactive React components for real-time restaurant table layout visualization and reservation management.'}</li>
        <li>${isEs 
          ? 'Integración y consumo de servicios backend, coordinación con diseñador UX/UI y resolución ágil de requerimientos bajo Scrum.' 
          : 'Integrated backend services, coordinated with UX/UI designers, and successfully delivered sprint milestones under Scrum.'}</li>
      </ul>
    </div>

    <!-- EXPERIENCIA: Atento Colombia -->
    <div class="item">
      <div class="item-top">
        <div>
          <span class="item-name">${isEs ? 'Representante de Servicio al Cliente y Soporte Técnico' : 'Customer Service & Technical Support Representative'}</span>
          <span class="item-company">· Atento</span>
        </div>
        <div class="item-date">08/2022 — 02/2023</div>
      </div>
      <div class="item-meta">${isEs ? 'Sector Telecomunicaciones' : 'Telecommunications Sector'}</div>
      <ul class="bullets">
        <li>${isEs 
          ? 'Atención y resolución metódica de incidencias técnicas y de facturación bajo estrictos estándares de calidad y cumplimiento de SLAs corporativos.' 
          : 'Methodical troubleshooting and resolution of technical and billing incidents adhering to corporate SLA benchmarks and QA metrics.'}</li>
        <li>${isEs 
          ? 'Escalamiento documentado a áreas especializadas con comunicación asertiva y alta orientación a resultados bajo presión.' 
          : 'Documented escalation to specialized departments with assertive communication and strong problem-solving under pressure.'}</li>
      </ul>
    </div>
  </section>

  <!-- EDUCACIÓN Y FORMACIÓN -->
  <section class="section">
    <h2 class="section-title">
      <span>${isEs ? 'Educación y Formación' : 'Education & Training'}</span>
    </h2>
    <div class="item">
      <div class="item-top">
        <div>
          <span class="item-name">${isEs ? 'Tecnólogo en Análisis y Desarrollo de Software (ADSO)' : 'Technologist in Software Analysis and Development (ADSO)'}</span>
          <span class="item-company">· SENA</span>
        </div>
        <div class="item-date">${isEs ? '2024 – 2026 (En Curso / Etapa Práctica)' : '2024 – 2026 (In Progress / Practical Stage)'}</div>
      </div>
      <div class="item-meta">
        ${isEs 
          ? 'Formación integral en ciclo de vida del software (SDLC), arquitectura de software, modelado de bases de datos relacionales (PostgreSQL, SQL), programación orientada a objetos (POO), patrones de diseño, pruebas unitarias y metodologías ágiles (Scrum).' 
          : 'Comprehensive education in Software Development Life Cycle (SDLC), software architecture, relational database modeling (PostgreSQL, SQL), Object-Oriented Programming (OOP), design patterns, automated testing, and agile methodologies (Scrum).'}
      </div>
    </div>
  </section>

  <!-- HABILIDADES TÉCNICAS -->
  <section class="section">
    <h2 class="section-title">
      <span>${isEs ? 'Habilidades Técnicas' : 'Technical Skills'}</span>
    </h2>
    <div class="skills-grid">
      <div class="skill-row">
        <span class="skill-category">${isEs ? 'Lenguajes de Programación:' : 'Programming Languages:'}</span>
        <span class="skill-list">TypeScript, JavaScript (ES6+), SQL, HTML5, CSS3, Python (Básico)</span>
      </div>
      <div class="skill-row">
        <span class="skill-category">Frontend:</span>
        <span class="skill-list">React 18/19, Next.js, Vite, Tailwind CSS v4, HTML5 Canvas API, Web Audio API, shadcn/ui, Radix UI</span>
      </div>
      <div class="skill-row">
        <span class="skill-category">Backend & Persistencia:</span>
        <span class="skill-list">Node.js, Express, REST APIs, PostgreSQL 16, TimescaleDB, OpenAPI 3.0 (Swagger), Docker Compose</span>
      </div>
      <div class="skill-row">
        <span class="skill-category">${isEs ? 'Arquitectura & Metodologías:' : 'Architecture & Methodologies:'}</span>
        <span class="skill-list">Clean Architecture, SOLID, DDD, IEEE 830 SRS, Modelo C4, Scrum, Git / GitHub, Vercel</span>
      </div>
      <div class="skill-row">
        <span class="skill-category">${isEs ? 'Idiomas:' : 'Languages:'}</span>
        <span class="skill-list">${isEs ? 'Español (Nativo) · Inglés (Técnico / B1 - Lectura fluida de documentación y redacción de especificaciones)' : 'Spanish (Native) · English (Technical / B1 - Fluent technical documentation reading & spec authoring)'}</span>
      </div>
    </div>
  </section>

</body>
</html>`;
}

async function generate() {
  const browser = await chromium.launch();
  
  for (const lang of ['es', 'en']) {
    const html = getCvHtml(lang);
    const htmlPath = path.resolve(`scripts/temp_cv_${lang}.html`);
    fs.writeFileSync(htmlPath, html, 'utf-8');
    
    const page = await browser.newPage({ viewport: { width: 850, height: 1200 } });
    await page.goto('file:///' + htmlPath, { waitUntil: 'networkidle' });
    
    const targetPdf = path.resolve(`public/cv${lang === 'en' ? '_en' : ''}.pdf`);
    await page.pdf({
      path: targetPdf,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '12mm',
        right: '15mm',
        bottom: '12mm',
        left: '15mm'
      }
    });

    console.log(`Generated public/cv${lang === 'en' ? '_en' : ''}.pdf`);

    // Verify page count and extract text
    const pdfBuf = fs.readFileSync(targetPdf);
    const parser = new PDFParse(new Uint8Array(pdfBuf));
    await parser.load();
    const res = await parser.getText();
    console.log(`[${lang.toUpperCase()}] Size: ${pdfBuf.length} bytes | Pages: ${res.pages.length} | Text length: ${res.text.length}`);

    fs.unlinkSync(htmlPath);
  }

  await browser.close();
}

if (require.main === module) {
  generate().catch(console.error);
}

module.exports = { generate, getCvHtml };
