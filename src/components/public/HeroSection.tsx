import React from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, ChevronRight, Clock, MapPin, Scissors } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { barbershop, openBookingModal } = useApp();

  // Determine if open right now (simple check)
  const currentHour = new Date().getHours();
  const isOpen = currentHour >= 9 && currentHour < 20;

  return (
    <section className="relative w-full pt-4 pb-3 px-4">
      {/* Top Bar Header inside card */}
      <div className="flex items-center justify-between py-2 mb-4">
        <div className="flex items-center gap-2.5">
          {barbershop.logoUrl ? (
            <img
              src={barbershop.logoUrl}
              alt={barbershop.name}
              className="w-10 h-10 rounded-full object-cover border border-white/20"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-black text-sm shadow-md"
              style={{ backgroundColor: 'var(--accent-color)' }}
            >
              <Scissors className="w-5 h-5 text-black" />
            </div>
          )}
          <div>
            <h1 className="text-base font-bold tracking-tight text-white leading-tight">
              {barbershop.name}
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-stone-400">
              <MapPin className="w-3 h-3 text-stone-400" />
              <span>{barbershop.neighborhood}, {barbershop.city.split('-')[0].trim()}</span>
            </div>
          </div>
        </div>

        {/* Operating status badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium glass-pill">
          <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          <span className="text-stone-300">{isOpen ? 'Aberto agora' : 'Horário especial'}</span>
        </div>
      </div>

      {/* Hero Visual Card */}
      <div
        className="relative w-full aspect-[4/3] rounded-[22px] overflow-hidden border border-white/10 shadow-2xl flex flex-col justify-end p-5 group"
        style={{ borderRadius: 'var(--border-radius)' }}
      >
        {/* Background Image with Fallback and Gradients */}
        <img
          src={barbershop.heroImageUrl}
          alt={barbershop.name}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          onError={(e) => {
            // graceful fallback container if image fails
            (e.target as HTMLElement).style.display = 'none';
          }}
        />

        {/* Deep Vignette Gradient Scrim for 100% legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/20 pointer-events-none" />

        {/* Hero Content Overlay */}
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 text-xs tracking-wide uppercase font-semibold" style={{ color: 'var(--accent-color)' }}>
            <span>Experiência Premium</span>
            <span aria-hidden="true">·</span>
            <span>Est. {barbershop.foundedYear}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            {barbershop.slogan}
          </h2>

          <p className="text-xs sm:text-sm text-stone-300 line-clamp-2 leading-relaxed">
            {barbershop.description}
          </p>

          {/* Primary CTA Button */}
          <div className="pt-2">
            <button
              onClick={() => openBookingModal()}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 font-bold text-sm tracking-tight text-black transition-all shadow-lg active:scale-[0.98] cursor-pointer"
              style={{
                backgroundColor: 'var(--accent-color)',
                borderRadius: 'var(--button-radius)'
              }}
            >
              <Calendar className="w-4 h-4 text-black stroke-[2.5]" />
              <span>Agendar horário agora</span>
              <ChevronRight className="w-4 h-4 text-black stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
