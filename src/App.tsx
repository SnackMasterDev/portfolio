import SakuraCanvas from './components/canvas/SakuraCanvas';
import KatanaCursor from './components/cursor/KatanaCursor';
import SakuraTree from './components/tree/SakuraTree';
import { HeroSection, ProjectsSection, ExperienceSection } from './components/sections';
import { ContactSection } from './components/contact/ContactSection';
import { SectionDivider } from './components/ui/SectionDivider';
import { Header } from './components/navigation/Header';
import { useLanguage } from './context/useLanguage';
import { getTranslations } from './data/translations';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';

const SAKURA_CONFIG = {
  prefersReducedMotion: false,
  petalCount: 32,
  minSpeedY: 55,
  maxSpeedY: 90,
  minSize: 15,
  maxSize: 25,
};
const KATANA_CONFIG = { prefersReducedMotion: false, lerpFactor: 0.35 };

export default function App() {
  const { language } = useLanguage();
  const t = getTranslations(language);

  return (
    <div className="relative min-h-screen bg-[#f4eee5] washi-pattern text-[#1c1c1e] selection:bg-[#fbcfe8] selection:text-[#1c1c1e]">
      {/* Cabecera flotante minimalista Washi con identidad, CV y Audio Zen */}
      <Header />

      {/* Canvas interactivo de petalos flotando en primer plano (z-20) con click-through */}
      <SakuraCanvas
        config={SAKURA_CONFIG}
        className="pointer-events-none fixed inset-0 z-20 h-full w-full"
      />

      {/* Puntero Katana estilizado con rotacion fisica garantizada */}
      <KatanaCursor config={KATANA_CONFIG} />

      {/* Árbol de cerezo que ocupa todo el ancho de la pantalla (100% width) */}
      <div className="relative w-full overflow-hidden">
        <SakuraTree className="w-full" />
      </div>

      {/* Contenido principal del portfolio con divisores Sumi-e y Kintsugi */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-16">
        <HeroSection />
        <SectionDivider variant="kintsugi" />
        <ProjectsSection />
        <SectionDivider variant="sumi" />
        <ExperienceSection />
        <SectionDivider variant="kintsugi" />
        <ContactSection />
      </main>

      <footer id="ground" data-testid="ground" className="relative z-10 border-t border-[#e3dacd] py-8 text-center text-xs text-[#6b6966]">
        <p>{t.footer.text}</p>
      </footer>
      <SpeedInsights />
      <Analytics />
    </div>
  );
}
