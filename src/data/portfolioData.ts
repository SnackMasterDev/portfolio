export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  link?: string;
  github?: string;
  featured?: boolean;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  highlights: string[];
}

export interface SocialLink {
  label: string;
  url: string;
}

export interface Profile {
  name: string;
  alias: string;
  title: string;
  bio: string;
  skills: string[];
  socialLinks: SocialLink[];
}

export const PORTFOLIO_PROFILE: Profile = {
  name: 'Juan Camilo García',
  alias: 'SnackMasterDev',
  title: 'Creative Frontend & Systems Engineer',
  bio: 'Specialist in building high-performance web applications, generative canvas graphics, and resilient developer tooling with uncompromising attention to craft and detail.',
  skills: [
    'TypeScript',
    'React 19',
    'Tailwind CSS',
    'Canvas API',
    'Node.js',
    'Vitest / TDD',
    'Clean Architecture',
  ],
  socialLinks: [
    { label: 'GitHub', url: 'https://github.com/SnackMasterDev' },
    { label: 'LinkedIn', url: 'https://linkedin.com/in/juancamilogarcia' },
  ],
};

export const PORTFOLIO_PROJECTS: Project[] = [
  {
    id: 'pricescope',
    title: 'PriceScope',
    tagline: 'E-commerce price intelligence & market trends analytics',
    description:
      'High-throughput real-time product price tracking system with predictive trend dashboards and visual alert channels.',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Data Visualizations'],
    link: 'https://pricescope.dev',
    github: 'https://github.com/SnackMasterDev/pricescope',
    featured: true,
  },
  {
    id: 'devbrain',
    title: 'DevBrain',
    tagline: 'Semantic memory and MCP developer knowledge engine',
    description:
      'Deterministic developer knowledge orchestration protocol and vector retrieval MCP server powering agentic workflows.',
    tags: ['TypeScript', 'MCP Protocol', 'Vector Search', 'TDD'],
    github: 'https://github.com/SnackMasterDev/devbrain',
    featured: true,
  },
  {
    id: 'sakura-interactive',
    title: 'Sakura Interactive Canvas',
    tagline: 'Hardware-accelerated Japanese petal physics engine',
    description:
      '60 FPS deterministic particle simulation with atmospheric wind turbulence, fluid collision bounds, and organic sway.',
    tags: ['HTML5 Canvas', 'Mathematics', 'Performance Optimization'],
    link: '#',
    featured: true,
  },
];

export const PORTFOLIO_EXPERIENCES: Experience[] = [
  {
    id: 'exp-lead-frontend',
    role: 'Senior Frontend & Systems Engineer',
    company: 'Independent & Open Source Innovation',
    period: '2023 — Present',
    description:
      'Designing and developing modern web architectures, developer tools, and micro-interactions with high visual fidelity and performance.',
    highlights: [
      'Architected reactive web interfaces with strict modular component boundaries (<100 lines/file).',
      'Engineered sub-millisecond particle physics routines on 2D canvas.',
      'Adopted TDD methodology achieving comprehensive unit and integration test coverage.',
    ],
  },
  {
    id: 'exp-fullstack-dev',
    role: 'Full Stack Engineer',
    company: 'Tech Solutions & Cloud Platforms',
    period: '2021 — 2023',
    description:
      'Led the end-to-end delivery of client-facing web portals and analytical dashboards.',
    highlights: [
      'Delivered responsive web applications integrating complex REST and streaming endpoints.',
      'Optimized Core Web Vitals and frontend rendering bottlenecks across multi-device viewports.',
    ],
  },
];
