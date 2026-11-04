import SakuraCanvas from './components/canvas/SakuraCanvas';
import KatanaCursor from './components/cursor/KatanaCursor';
import { HeroSection, ProjectsSection, ExperienceSection } from './components/sections';
import { ContactSection } from './components/contact/ContactSection';

export default function App() {
  return (
    <div className="relative min-h-screen bg-[#1c1c1e] text-[#f2f0ed] selection:bg-[#f3a4c2] selection:text-[#1c1c1e]">
      {/* Canvas interactivo de petalos flotando en primer plano (z-20) con click-through */}
      <SakuraCanvas
        config={{ prefersReducedMotion: false, petalCount: 65, minSpeedY: 65, maxSpeedY: 125 }}
        className="pointer-events-none fixed inset-0 z-20 h-full w-full"
      />

      {/* Puntero Katana estilizado con rotacion fisica garantizada */}
      <KatanaCursor config={{ prefersReducedMotion: false, lerpFactor: 0.35 }} />

      {/* Contenido principal del portfolio */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-24">
        <HeroSection />
        <ProjectsSection />
        <ExperienceSection />
        <ContactSection />
      </main>

      <footer className="relative z-10 border-t border-[#3c3b3d]/60 py-8 text-center text-xs text-[#aaa7a3]">
        <p>© 2026 Juan Camilo Garcia · SnackMasterDev. Interfaces que respiran.</p>
      </footer>
    </div>
  );
}
