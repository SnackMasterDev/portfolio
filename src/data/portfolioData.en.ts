import type { Profile, Project, Experience } from './portfolioData.types';

export const PORTFOLIO_PROFILE_EN: Profile = {
  name: 'Juan Camilo García Gómez',
  alias: 'SnackMasterDev',
  title: 'Junior Frontend Developer | React 19, Next.js 16, TypeScript',
  bio: 'Junior Frontend Developer and Software Analysis and Development (ADSO) student at SENA. Hands-on experience building functional web interfaces using TypeScript, React, Next.js, Vite, Tailwind CSS, and REST API consumption under Scrum methodology.',
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
    'REST APIs',
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

export const PORTFOLIO_PROJECTS_EN: Project[] = [
  {
    id: 'pricescope',
    title: 'PriceScope',
    tagline: 'Real Multi-Currency Inflation Monitor (B2B Analytics)',
    description:
      'Executive B2B dashboard to visualize price time series and foreign exchange variations with Next.js 16 (App Router), React 19, TypeScript, and Recharts 3.10.',
    longDescription:
      'Led the Frontend architecture and authored complete technical engineering documentation (SRS, OpenAPI 3.0, relational PostgreSQL 16 + TimescaleDB schema, and risk matrix) based on Product Owner user stories. Implemented high-fidelity time-series visualization with Recharts 3.10, inflation alerts, and historical append-only CSV audit.',
    tags: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS v4', 'Recharts', 'PostgreSQL', 'Docker'],
    architecture: [
      'Next.js 16 App Router with Server Components and React 19',
      'High-fidelity time-series visualization with Recharts 3.10',
      'End-to-end authoring of SRS specification and OpenAPI 3.0 contracts',
      'Docker Compose with PostgreSQL 16 + TimescaleDB',
    ],
    metrics: ['Real-time time series', 'Append-only CSV export', '100% strict typing'],
    link: 'https://pricescope-frontend.vercel.app',
    github: 'https://github.com/No-Country-simulation/S10-26-EQUIPO-2-PriceScope',
    image: '/projects/pricescope.jpg',
    badge: 'Live in Production',
    featured: true,
  },
  {
    id: 'serviceflow',
    title: 'ServiceFlow',
    tagline: 'IT Request & Ticket Management Platform',
    description:
      'Complete interface to centralize internal IT support requests with real-time status tracking and knowledge module with HTTP JSONB persistence.',
    longDescription:
      'ServiceFlow solves technical helpdesk bottlenecks. Integrates user authentication, incident categorization, SLA tracking, and dynamic in-memory filtering with React and Tailwind CSS under Scrum agile methodology.',
    tags: ['React', 'Vite', 'Tailwind CSS', 'shadcn/ui', 'REST API', 'Scrum'],
    architecture: [
      'Modular atomic components (<100 lines) under SOLID principles',
      'Decoupled consumption layer with HTTP schema validation',
      'Optimized state management without unnecessary re-renders',
    ],
    metrics: ['+40% triage speed', '<100ms filter response', '100% responsive'],
    link: 'https://s08-26-equipo-7.vercel.app',
    github: 'https://github.com/No-Country-simulation/S08-26-equipo-7',
    image: '/projects/serviceflow.jpg',
    badge: 'Agile Simulation',
    featured: true,
  },
  {
    id: 'mizu',
    title: 'Mizu Ecosystem',
    tagline: 'Omnichannel Restaurant Management Ecosystem (SENA Capstone)',
    description:
      'Modular suite of 5 decoupled applications (Customer Web, Mobile App, POS, Recipe Inventory, and Core API) with formal IEEE 830 and C4 specifications.',
    longDescription:
      'Capstone graduation project for Software Analysis and Development (SENA ADSO). Led product conception, IEEE 830 (SRS) specification, user story catalog with Gherkin acceptance criteria (BDD), relational PostgreSQL 16 schema, and container architecture for web (React), mobile (React Native Expo), and desktop (Electron).',
    tags: ['TypeScript', 'React', 'React Native', 'Node.js', 'PostgreSQL 16', 'C4 Model', 'IEEE 830'],
    architecture: [
      'Decoupled modular monorepo with formal OpenAPI specifications',
      '3-level C4 model architecture and UML class diagrams',
      'ACID relational schema in PostgreSQL 16 with recipe-level stock control',
    ],
    metrics: ['100% SRS Documentation', '5 Monorepo Apps', 'Gherkin BDD Criteria'],
    github: 'https://github.com/SnackMasterDev/mizu-ecosystem',
    image: '/projects/mizu.png',
    badge: 'In Development · Capstone Project',
    featured: true,
  },
  {
    id: 'reservapp',
    title: 'ReservApp',
    tagline: 'Restaurant Reservation & Table Availability System',
    description:
      'Interactive physical table layout component with dynamic seat calculation and conditional rendering based on requested capacity.',
    longDescription:
      'Comprehensive solution for dining and hospitality that simulates the dining room layout in real time, allowing guests to reserve specific tables with instant backend validation.',
    tags: ['React', 'CSS3', 'REST API Consumption', 'Scrum'],
    architecture: [
      'Dynamic spatial table layout mapping in a 2D matrix',
      'Optimistic feedback and real-time availability synchronization',
      'Scrum squad with continuous pull request reviews on GitHub',
    ],
    metrics: ['Zero overbooking', '3-step reservation', 'Instant visual feedback'],
    link: 'https://develop--reserv-app.netlify.app',
    github: 'https://github.com/No-Country-simulation/s16-05-m-php-react',
    featured: false,
  },
];

export const PORTFOLIO_EXPERIENCES_EN: Experience[] = [
  {
    id: 'exp-nocountry-lead',
    role: 'Frontend Tech Lead & UX/UI Designer (Agile Simulation)',
    company: 'No Country',
    period: '10/2026 — 11/2026',
    description:
      'Led the web client architecture and development for PriceScope using Next.js 16, React 19, TypeScript, Tailwind CSS v4, and Recharts 3.10 under Scrum methodology.',
    highlights: [
      'Technical interface architecture leadership with Next.js 16 (App Router), React 19, and Radix UI.',
      'Data environment setup on PostgreSQL 16 + TimescaleDB using Docker Compose.',
      'Co-authored technical engineering documentation (SRS, OpenAPI 3.0, relational schema, and risk matrix).',
    ],
  },
  {
    id: 'exp-nocountry-frontend',
    role: 'Frontend Developer (Agile Simulation)',
    company: 'No Country',
    period: '10/2026',
    description:
      'Collaborative development within Scrum teams, continuous delivery, and peer code reviews in a cross-functional squad.',
    highlights: [
      'Modular UI component construction using React, Vite, Tailwind CSS, and shadcn/ui components.',
      'Collaborative workflow management via branches, pull requests, and conflict resolution on GitHub.',
      'Connection and integration with REST API endpoints for status and assignee traceability.',
    ],
  },
  {
    id: 'exp-nocountry-fullstack',
    role: 'Full Stack Developer (Agile Simulation)',
    company: 'No Country',
    period: '07/2024 — 08/2024',
    description:
      'Visual web component development and backend service integration for table availability management.',
    highlights: [
      'Interactive React component development for real-time reservation visualization.',
      'Coordination with backend developers and UX/UI designers for sprint delivery.',
    ],
  },
  {
    id: 'exp-atento',
    role: 'Customer Service & Technical Support Representative',
    company: 'Atento',
    period: '08/2022 — 02/2023',
    description:
      'Handled telecommunication customer incidents under strict quality assurance standards and technical protocols.',
    highlights: [
      'Methodical resolution of billing and technical inquiries with assertive communication.',
      'Documented escalation to specialized departments ensuring case traceability.',
    ],
  },
];
