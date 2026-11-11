import type { Language } from '../context/useLanguage';

export interface Translations {
  header: {
    availableForWork: string;
    downloadCv: string;
    cvFile: string;
    portfolioRepoTitle: string;
    gitHubTitle: string;
    linkedInTitle: string;
    homeTitle: string;
    langSwitchLabel: string;
    openMenu: string;
    closeMenu: string;
  };
  navigation: {
    skipToContent: string;
  };
  projects: {
    kicker: string;
    title: string;
    subtitle: string;
    badgeLive: string;
    badgeSimulation: string;
    badgeGraduation: string;
    badgeEngine: string;
    exploreDemo: string;
    viewTechSpecs: string;
    viewCode: string;
    openLiveApp: string;
    repository: string;
    modalCloseAria: string;
    modalArchTitle: string;
  };
  experience: {
    kicker: string;
    title: string;
  };
  contact: {
    title: string;
    subtitle: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    submitIdle: string;
    submitSubmitting: string;
    submitSuccess: string;
    submitErrorSpam: string;
    submitErrorFast: string;
    submitErrorEmail: string;
    submitErrorMissing: string;
    submitErrorGeneric: string;
  };
  footer: {
    text: string;
  };
}

export const TRANSLATIONS: Record<Language, Translations> = {
  es: {
    header: {
      availableForWork: 'Disponible para Trabajar',
      downloadCv: 'Descargar CV',
      cvFile: 'CV_Juan_Camilo_Garcia_ES.pdf',
      portfolioRepoTitle: 'Ver despliegue en producción de este Portfolio (snackmaster.me)',
      gitHubTitle: 'Perfil de GitHub',
      linkedInTitle: 'Perfil de LinkedIn',
      homeTitle: 'Ir al inicio - SnackMasterDev',
      langSwitchLabel: 'Cambiar idioma a inglés',
      openMenu: 'Abrir menú de navegación',
      closeMenu: 'Cerrar menú de navegación',
    },
    navigation: {
      skipToContent: 'Saltar al contenido principal',
    },
    projects: {
      kicker: 'PROYECTOS',
      title: 'Proyectos Destacados',
      subtitle: 'Sistemas web con foco en arquitectura modular, interfaces en tiempo real y rendimiento.',
      badgeLive: 'En Producción',
      badgeSimulation: 'Simulación Ágil',
      badgeGraduation: 'En Desarrollo · Grado SENA',
      badgeEngine: 'Motor Gráfico & UI',
      exploreDemo: 'Explorar Demo ↗',
      viewTechSpecs: 'Ficha Técnica',
      viewCode: 'Ver Código en GitHub',
      openLiveApp: 'Abrir Aplicación en Vivo ↗',
      repository: 'Repositorio ↗',
      modalCloseAria: 'Cerrar modal de proyecto',
      modalArchTitle: 'Arquitectura & Decisiones Técnicas',
    },
    experience: {
      kicker: 'TRAYECTORIA',
      title: 'Experiencia Profesional',
    },
    contact: {
      title: 'Hablemos',
      subtitle: '¿Tienes un proyecto en mente o quieres conectar? Envíame un mensaje.',
      nameLabel: 'Nombre',
      namePlaceholder: 'Tu nombre',
      emailLabel: 'Correo Electrónico',
      emailPlaceholder: 'tu@correo.com',
      messageLabel: 'Mensaje',
      messagePlaceholder: '¿En qué te puedo ayudar?',
      submitIdle: 'Enviar Mensaje',
      submitSubmitting: 'Enviando...',
      submitSuccess: 'Mensaje entregado con honor',
      submitErrorSpam: 'Envío bloqueado por protección del santuario.',
      submitErrorFast: 'Un instante de calma antes de enviar el trazo.',
      submitErrorEmail: 'La dirección no parece auténtica.',
      submitErrorMissing: 'El pergamino está incompleto.',
      submitErrorGeneric: 'El mensaje no alcanzó destino — Reintentar',
    },
    footer: {
      text: '© 2026 Juan Camilo Garcia · SnackMasterDev. Interfaces que respiran.',
    },
  },
  en: {
    header: {
      availableForWork: 'Available for Work',
      downloadCv: 'Download CV',
      cvFile: 'CV_Juan_Camilo_Garcia_EN.pdf',
      portfolioRepoTitle: 'View production deployment of this Portfolio (snackmaster.me)',
      gitHubTitle: 'GitHub Profile',
      linkedInTitle: 'LinkedIn Profile',
      homeTitle: 'Go to home - SnackMasterDev',
      langSwitchLabel: 'Switch language to Spanish',
      openMenu: 'Open navigation menu',
      closeMenu: 'Close navigation menu',
    },
    navigation: {
      skipToContent: 'Skip to main content',
    },
    projects: {
      kicker: 'PROJECTS',
      title: 'Featured Projects',
      subtitle: 'Web systems focused on modular architecture, real-time interfaces, and high performance.',
      badgeLive: 'Live in Production',
      badgeSimulation: 'Agile Simulation',
      badgeGraduation: 'In Development · Capstone Project',
      badgeEngine: 'Graphics Engine & UI',
      exploreDemo: 'Explore Demo ↗',
      viewTechSpecs: 'Tech Specs',
      viewCode: 'View Code on GitHub',
      openLiveApp: 'Open Live App ↗',
      repository: 'Repository ↗',
      modalCloseAria: 'Close project modal',
      modalArchTitle: 'Architecture & Technical Decisions',
    },
    experience: {
      kicker: 'CAREER',
      title: 'Professional Experience',
    },
    contact: {
      title: "Let's Talk",
      subtitle: 'Have a project in mind or want to connect? Send me a message.',
      nameLabel: 'Name',
      namePlaceholder: 'Your name',
      emailLabel: 'Email Address',
      emailPlaceholder: 'you@example.com',
      messageLabel: 'Message',
      messagePlaceholder: 'How can I help you?',
      submitIdle: 'Send Message',
      submitSubmitting: 'Sending...',
      submitSuccess: 'Message delivered with honor',
      submitErrorSpam: 'Submission blocked by sanctuary protection.',
      submitErrorFast: 'A moment of calm before sending the stroke.',
      submitErrorEmail: 'The address does not appear authentic.',
      submitErrorMissing: 'The scroll is incomplete.',
      submitErrorGeneric: 'Message could not reach destination — Retry',
    },
    footer: {
      text: '© 2026 Juan Camilo Garcia · SnackMasterDev. Interfaces that breathe.',
    },
  },
};

export function getTranslations(lang: Language): Translations {
  return TRANSLATIONS[lang] ?? TRANSLATIONS.es;
}
