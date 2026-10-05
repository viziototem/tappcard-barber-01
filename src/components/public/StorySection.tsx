import React from 'react';
import { useApp } from '../../context/AppContext';
import { Award, Compass, ShieldCheck } from 'lucide-react';

export const StorySection: React.FC = () => {
  const { barbershop } = useApp();

  return (
    <section className="px-4 py-4">
      <div
        className="rounded-[22px] bg-[#121212] border border-white/[0.08] p-5 space-y-4 overflow-hidden relative"
        style={{ borderRadius: 'var(--border-radius)' }}
      >
        {/* Subtle decorative glow */}
        <div
          className="absolute -top-20 -right-20 w-44 h-44 rounded-full blur-3xl opacity-10 pointer-events-none"
          style={{ backgroundColor: 'var(--accent-color)' }}
        />

        {/* Section Header */}
        <div className="flex items-center justify-between">
          <div>
            <span
              className="text-[11px] font-bold tracking-wider uppercase"
              style={{ color: 'var(--accent-color)' }}
            >
              Tradição & Visagismo
            </span>
            <h3 className="text-xl font-extrabold text-white tracking-tight mt-0.5">
              Nossa História
            </h3>
          </div>
          <div className="text-right">
            <span className="text-xs text-stone-500 font-mono">DESDE</span>
            <p className="text-sm font-bold text-white font-mono">{barbershop.foundedYear}</p>
          </div>
        </div>

        {/* Craftsman Imagery */}
        <div className="relative aspect-[16/10] rounded-[16px] overflow-hidden border border-white/10">
          <img
            src={barbershop.storyImageUrl || '/src/assets/images/barber_craftsman_story_1791211108272.jpg'}
            alt="Mestre Barbeiro"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 text-xs text-stone-200 font-medium">
            "Mais que um corte, um momento exclusivo de pausa e autocuidado."
          </div>
        </div>

        {/* Story Prose */}
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
          {barbershop.story}
        </p>

        {/* Differentials / Pillars (clean text hierarchy) */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.06]">
          <div className="text-center p-2 rounded-xl bg-white/[0.03]">
            <Award className="w-4 h-4 mx-auto mb-1 text-stone-300" />
            <p className="text-[11px] font-bold text-white">Excelência</p>
            <p className="text-[9px] text-stone-400">Técnica apurada</p>
          </div>
          <div className="text-center p-2 rounded-xl bg-white/[0.03]">
            <Compass className="w-4 h-4 mx-auto mb-1 text-stone-300" />
            <p className="text-[11px] font-bold text-white">Visagismo</p>
            <p className="text-[9px] text-stone-400">Estilo sob medida</p>
          </div>
          <div className="text-center p-2 rounded-xl bg-white/[0.03]">
            <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-stone-300" />
            <p className="text-[11px] font-bold text-white">Higiene 100%</p>
            <p className="text-[9px] text-stone-400">Navalha descartável</p>
          </div>
        </div>
      </div>
    </section>
  );
};
