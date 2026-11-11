import type { Profile, Project, Experience } from './portfolioData.types';

export const PORTFOLIO_PROFILE_ES: Profile = {
  name: 'Juan Camilo García Gómez',
  alias: 'SnackMasterDev',
  title: 'Desarrollador Frontend Junior | React 19, Next.js 16, TypeScript',
  bio: 'Desarrollador Frontend Junior y estudiante de Tecnología en Análisis y Desarrollo de Software (ADSO) en el SENA. Experiencia práctica en construcción de interfaces web funcionales utilizando TypeScript, React, Next.js, Vite, Tailwind CSS y consumo de APIs REST bajo metodología Scrum.',
  location: 'Lebrija, Santander, Colombia',
  email: 'jcgarcia1565@gmail.com',
  skills: [
    'TypeScript',
    'React 19',
    'Next.js 16',
    'JavaScript (ES6+)',
    'Tailwind CSS v4',
    'shadcn/ui',
    'Radix UI',
    'Recharts 3.10',
    'APIs REST',
    'PostgreSQL 16',
    'Docker Compose',
    'Git / GitHub',
    'Scrum',
  ],
  socialLinks: [
    { label: 'GitHub', url: 'https://github.com/SnackMasterDev' },
    { label: 'LinkedIn', url: 'https://linkedin.com/in/juan-camilo-garcia-' },
  ],
};

export const PORTFOLIO_PROJECTS_ES: Project[] = [
  {
    id: 'pricescope',
    title: 'PriceScope',
    tagline: 'Monitor de Inflación Real Multimoneda (Analítica B2B)',
    description:
      'Panel ejecutivo para visualizar series temporales de precios y variaciones cambiarias con Next.js 16 (App Router), React 19, TypeScript y Recharts 3.10.',
    longDescription:
      'Lideré la arquitectura Frontend y elaboré la especificación técnica completa (SRS, OpenAPI 3.0, modelo relacional en PostgreSQL 16 + TimescaleDB y matriz de riesgos) a partir de las historias de usuario del Product Owner. Implementé visualización de series temporales de alta fidelidad con Recharts 3.10, alertas de inflación y auditoría histórica con exportación CSV.',
    tags: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS v4', 'Recharts', 'PostgreSQL', 'Docker'],
    architecture: [
      'Next.js 16 App Router con Componentes de Servidor y React 19',
      'Visualización de series temporales de alta fidelidad con Recharts 3.10',
      'Elaboración integral de especificación SRS y contratos OpenAPI 3.0',
      'Docker Compose con PostgreSQL 16 + TimescaleDB',
    ],
    metrics: ['Series temporales en tiempo real', 'Exportación CSV de solo adición', '100% tipado estricto'],
    link: 'https://pricescope-frontend.vercel.app',
    github: 'https://github.com/No-Country-simulation/S10-26-EQUIPO-2-PriceScope',
    image: '/projects/pricescope.jpg',
    badge: 'En Producción',
    featured: true,
  },
  {
    id: 'serviceflow',
    title: 'ServiceFlow',
    tagline: 'Plataforma de Gestión de Solicitudes y Tickets de Soporte TI',
    description:
      'Interfaz integral para centralizar solicitudes internas de soporte técnico con trazabilidad de estados en tiempo real y módulo de conocimiento con persistencia JSONB vía HTTP.',
    longDescription:
      'ServiceFlow resuelve el cuello de botella en mesas de ayuda técnica. Integra autenticación de usuarios, categorización de incidencias, seguimiento de acuerdos de nivel de servicio (SLA) y filtrado dinámico en memoria con React y Tailwind CSS bajo metodología ágil Scrum.',
    tags: ['React', 'Vite', 'Tailwind CSS', 'shadcn/ui', 'API REST', 'Scrum'],
    architecture: [
      'Componentes atómicos modulares (<100 líneas) bajo principios SOLID',
      'Capa de consumo desacoplada con validación de esquemas HTTP',
      'Gestión de estado optimizada sin re-renders innecesarios',
    ],
    metrics: ['+40% agilidad en clasificación', '<100ms respuesta en filtros', '100% adaptable'],
    link: 'https://s08-26-equipo-7.vercel.app',
    github: 'https://github.com/No-Country-simulation/S08-26-equipo-7',
    image: '/projects/serviceflow.jpg',
    badge: 'Simulación Ágil',
    featured: true,
  },
  {
    id: 'mizu',
    title: 'Mizu Ecosystem',
    tagline: 'Ecosistema Omnicanal para Cadenas de Restaurantes (Grado SENA)',
    description:
      'Suite modular de 5 aplicaciones desacopladas (Web cliente, app móvil, POS de salón, escandallo de inventarios y API central) con especificación formal IEEE 830 y modelo C4.',
    longDescription:
      'Proyecto de grado para la titulación en Análisis y Desarrollo de Software (SENA ADSO). Lideré la concepción de producto, especificación IEEE 830 (SRS), catálogo de historias de usuario con criterios de aceptación Gherkin (BDD), modelo relacional en PostgreSQL 16 y arquitectura de contenedores para suite web (React), móvil (React Native Expo) y escritorio (Electron).',
    tags: ['TypeScript', 'React', 'React Native', 'Node.js', 'PostgreSQL 16', 'C4 Model', 'IEEE 830'],
    architecture: [
      'Monorepo modular desacoplado con especificación formal OpenAPI',
      'Arquitectura C4 en 3 niveles y diagramas de clases UML',
      'Modelo relacional transaccional ACID en PostgreSQL 16 con control de recetas',
    ],
    metrics: ['100% Documentación SRS', '5 Apps en Monorepo', 'Criterios BDD Gherkin'],
    github: 'https://github.com/SnackMasterDev/mizu-ecosystem',
    image: '/projects/mizu.png',
    badge: 'En Desarrollo · Grado SENA',
    featured: true,
  },
  {
    id: 'reservapp',
    title: 'ReservApp',
    tagline: 'Sistema de Reservas y Disponibilidad para Restaurantes',
    description:
      'Componente interactivo de distribución física de mesas en local comercial con cálculo dinámico de puestos y renderizado condicional según capacidad solicitada.',
    longDescription:
      'Solución integral para gastronomía y hostelería que simula la distribución física del salón en tiempo real, permitiendo a los comensales reservar mesas exactas con validación inmediata contra el backend.',
    tags: ['React', 'CSS3', 'Consumo API REST', 'Scrum'],
    architecture: [
      'Mapeo dinámico de distribución espacial de mesas en matriz 2D',
      'Respuesta optimista y sincronización de disponibilidad en tiempo real',
      'Célula Scrum con revisiones continuas en GitHub',
    ],
    metrics: ['Cero sobrecupos', 'Reserva en 3 pasos', 'Respuesta visual instantánea'],
    link: 'https://develop--reserv-app.netlify.app',
    github: 'https://github.com/No-Country-simulation/s16-05-m-php-react',
    featured: false,
  },
];

export const PORTFOLIO_EXPERIENCES_ES: Experience[] = [
  {
    id: 'exp-nocountry-lead',
    role: 'Líder Técnico Frontend y Diseñador UX/UI (Simulación Ágil)',
    company: 'No Country',
    period: '10/2026 — 11/2026',
    description:
      'Lideré la arquitectura y desarrollo del cliente web de PriceScope utilizando Next.js 16, React 19, TypeScript, Tailwind CSS v4 y Recharts 3.10 bajo metodología Scrum.',
    highlights: [
      'Liderazgo técnico en arquitectura de interfaz con Next.js 16 (App Router), React 19 y Radix UI.',
      'Configuración del entorno de datos en PostgreSQL 16 + TimescaleDB con Docker Compose.',
      'Co-elaboración de documentación técnica de ingeniería (SRS, OpenAPI 3.0, modelo relacional y matriz de riesgos).',
    ],
  },
  {
    id: 'exp-nocountry-frontend',
    role: 'Desarrollador Frontend (Simulación Ágil)',
    company: 'No Country',
    period: '10/2026',
    description:
      'Desarrollo colaborativo en células de trabajo bajo metodología Scrum, entregas continuas y revisiones de código en equipo multidisciplinar.',
    highlights: [
      'Construcción modular de interfaz de usuario con React, Vite, Tailwind CSS y componentes de shadcn/ui.',
      'Gestión de flujos de trabajo colaborativos mediante ramas, solicitudes de extracción y resolución de conflictos en GitHub.',
      'Conexión e integración con puntos de enlace API REST para trazabilidad de estados y responsables.',
    ],
  },
  {
    id: 'exp-nocountry-fullstack',
    role: 'Desarrollador Full Stack (Simulación Ágil)',
    company: 'No Country',
    period: '07/2024 — 08/2024',
    description:
      'Desarrollo de componentes visuales web e integración con servicios backend para control de disponibilidad.',
    highlights: [
      'Construcción de componentes interactivos en React para visualización en tiempo real de reservas.',
      'Coordinación con desarrolladores backend y diseño UX/UI para cumplimiento de sprints.',
    ],
  },
  {
    id: 'exp-atento',
    role: 'Representante de Servicio al Cliente y Soporte',
    company: 'Atento',
    period: '08/2022 — 02/2023',
    description:
      'Atención de incidencias de usuarios del sector telecomunicaciones bajo estrictas normas de calidad y protocolos técnicos.',
    highlights: [
      'Resolución metódica de consultas de facturación y servicios técnicos con comunicación asertiva.',
      'Escalamiento documentado a áreas especializadas garantizando la trazabilidad de cada caso.',
    ],
  },
];
