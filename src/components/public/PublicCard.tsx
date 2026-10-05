import React from 'react';
import { HeroCarousel } from './HeroCarousel';
import { QuickLinksGrid } from './QuickLinksGrid';
import { ServicesSection } from './ServicesSection';
import { GallerySection } from './GallerySection';
import { StorySection } from './StorySection';
import { LocationSection } from './LocationSection';
import { ReviewsSection } from './ReviewsSection';
import { InstagramSection } from './InstagramSection';
import { CustomSection } from './CustomSection';
import { PublicFooter } from './PublicFooter';
import { StickyBottomNav } from './StickyBottomNav';
import { BookingModal } from './BookingModal';
import { WifiModal } from './WifiModal';
import { PixModal } from './PixModal';
import { ClosedNoticePopup } from './ClosedNoticePopup';
import { MediaPickerModal } from './MediaPickerModal';
import { useApp } from '../../context/AppContext';
import { Smartphone, Monitor, ShieldCheck } from 'lucide-react';

export const PublicCard: React.FC = () => {
  const { setCurrentView, isAdminLoggedIn, sections } = useApp();
  const [deviceFrameMode, setDeviceFrameMode] = React.useState(true);

  // Active sorted sections
  const activeSections = [...sections]
    .filter(s => s.visible)
    .sort((a, b) => a.order - b.order);

  const renderSection = (sec: typeof sections[0]) => {
    switch (sec.type) {
      case 'hero':
        return <HeroCarousel key={sec.id} />;
      case 'quick_links':
        return <QuickLinksGrid key={sec.id} />;
      case 'services':
        return <ServicesSection key={sec.id} />;
      case 'gallery':
        return <GallerySection key={sec.id} />;
      case 'story':
        return <StorySection key={sec.id} />;
      case 'location':
        return <LocationSection key={sec.id} />;
      case 'instagram_feed':
        return <InstagramSection key={sec.id} />;
      case 'google_reviews':
        return <ReviewsSection key={sec.id} />;
      case 'custom':
        return <CustomSection key={sec.id} section={sec} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] flex flex-col items-center justify-start relative selection:bg-[#A8FF3E] selection:text-black">
      {/* Desktop Ambient Luxury Glows */}
      <div className="hidden lg:block fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[140px] opacity-15"
          style={{ backgroundColor: 'var(--accent-color)' }}
        />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-600/10 blur-[140px]" />
      </div>

      {/* Desktop Header Bar (Quick switcher to Admin & Frame toggle) */}
      <div className="hidden lg:flex w-full max-w-6xl items-center justify-between py-3 px-6 z-20 text-xs text-stone-400">
        <div className="flex items-center gap-3">
          <span className="font-bold text-white tracking-wider uppercase text-[11px]">
            TappCard Virtual Card
          </span>
          <span className="text-stone-600">·</span>
          <span className="text-stone-400">Página Pública Dinâmica com Carrossel & Status</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setDeviceFrameMode(!deviceFrameMode)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/10 text-stone-300 transition-colors cursor-pointer"
          >
            {deviceFrameMode ? (
              <>
                <Smartphone className="w-3.5 h-3.5 text-[#A8FF3E]" />
                <span>Modo Smartphone</span>
              </>
            ) : (
              <>
                <Monitor className="w-3.5 h-3.5 text-stone-300" />
                <span>Modo Fluido</span>
              </>
            )}
          </button>

          <button
            onClick={() => setCurrentView(isAdminLoggedIn ? 'admin' : 'admin-login')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-semibold transition-all cursor-pointer shadow-sm"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#A8FF3E]" />
            <span>{isAdminLoggedIn ? 'Painel Admin' : 'Acesso Proprietário'}</span>
          </button>
        </div>
      </div>

      {/* Center Mobile Card Container */}
      <main
        className={`w-full ${
          deviceFrameMode
            ? 'max-w-[440px] lg:my-6 lg:rounded-[36px] lg:border lg:border-white/15 lg:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)]'
            : 'max-w-[480px]'
        } relative z-10 flex flex-col transition-all duration-300`}
        style={{
          backgroundColor: 'var(--bg-color)',
        }}
      >
        {/* Dynamic Section Ordering */}
        {activeSections.map(renderSection)}

        {/* Footer */}
        <PublicFooter />

        {/* Floating / Sticky Mobile Navigation */}
        <StickyBottomNav />

        {/* Dynamic Modals */}
        <BookingModal />
        <WifiModal />
        <PixModal />
        <ClosedNoticePopup />
        <MediaPickerModal />
      </main>
    </div>
  );
};
