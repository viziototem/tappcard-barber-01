import React from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, MessageCircle, MapPin, Scissors } from 'lucide-react';

export const StickyBottomNav: React.FC = () => {
  const { openBookingModal, barbershop, trackMetric } = useApp();

  const handleWhatsApp = () => {
    trackMetric('whatsappClicks');
    const phone = barbershop.whatsapp.replace(/\D/g, '');
    const text = encodeURIComponent(`Olá! Gostaria de falar com a ${barbershop.name}.`);
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  const handleScrollToServices = () => {
    const el = document.getElementById('services-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 max-w-[480px] mx-auto px-4 pb-3 pt-2 bg-gradient-to-t from-black via-black/95 to-transparent pointer-events-auto">
      <div className="flex items-center gap-2 p-1.5 rounded-full bg-[#181818]/90 backdrop-blur-xl border border-white/15 shadow-2xl">
        {/* Quick WhatsApp shortcut */}
        <button
          onClick={handleWhatsApp}
          className="w-11 h-11 rounded-full flex items-center justify-center bg-white/[0.08] hover:bg-white/15 text-emerald-400 active:scale-95 transition-all shrink-0 cursor-pointer"
          title="Falar no WhatsApp"
          aria-label="Falar no WhatsApp"
        >
          <MessageCircle className="w-5 h-5 fill-emerald-500/20" />
        </button>

        {/* Quick Services shortcut */}
        <button
          onClick={handleScrollToServices}
          className="w-11 h-11 rounded-full flex items-center justify-center bg-white/[0.08] hover:bg-white/15 text-stone-300 active:scale-95 transition-all shrink-0 cursor-pointer"
          title="Ver Serviços"
          aria-label="Ver Serviços"
        >
          <Scissors className="w-5 h-5" />
        </button>

        {/* Main Floating Action Button: Agendar Horário */}
        <button
          onClick={() => openBookingModal()}
          className="flex-1 h-11 flex items-center justify-center gap-2 px-4 rounded-full font-bold text-xs sm:text-sm text-black transition-all active:scale-[0.98] shadow-lg cursor-pointer"
          style={{
            backgroundColor: 'var(--accent-color)'
          }}
        >
          <Calendar className="w-4 h-4 text-black stroke-[2.5]" />
          <span className="font-extrabold tracking-tight">Agendar Horário</span>
        </button>
      </div>
    </div>
  );
};
