import SakuraCanvas from './components/canvas/SakuraCanvas';
import KatanaCursor from './components/cursor/KatanaCursor';
import SakuraTree from './components/tree/SakuraTree';
import { HeroSection, ProjectsSection, ExperienceSection } from './components/sections';
import { ContactSection } from './components/contact/ContactSection';

export default function App() {
  return (
    <div className="relative min-h-screen bg-[#f4eee5] text-[#1c1c1e] selection:bg-[#fbcfe8] selection:text-[#1c1c1e]">
      {/* Canvas interactivo de petalos flotando en primer plano (z-20) con click-through */}
      <SakuraCanvas
        config={{ prefersReducedMotion: false, petalCount: 75, minSpeedY: 65, maxSpeedY: 125 }}
        className="pointer-events-none fixed inset-0 z-20 h-full w-full"
      />

      {/* Puntero Katana estilizado con rotacion fisica garantizada */}
      <KatanaCursor config={{ prefersReducedMotion: false, lerpFactor: 0.35 }} />

      {/* Árbol de cerezo que ocupa todo el ancho de la pantalla (100% width) */}
      <div className="relative w-full overflow-hidden">
        <SakuraTree className="w-full" />
      </div>

      {/* Contenido principal del portfolio */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-24">
        <HeroSection />
        <ProjectsSection />
        <ExperienceSection />
        <ContactSection />
      </main>

      <footer id="ground" data-testid="ground" className="relative z-10 border-t border-[#e3dacd] py-8 text-center text-xs text-[#6b6966]">
        <p>© 2026 Juan Camilo Garcia · SnackMasterDev. Interfaces que respiran.</p>
      </footer>
    </div>
  );
}
