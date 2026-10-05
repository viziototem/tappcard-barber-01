import React from 'react';
import { useApp } from '../../context/AppContext';
import { DEFAULT_TESTIMONIALS } from '../../data/defaultData';
import { Star, CheckCircle, ExternalLink } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  const { barbershop } = useApp();

  const handleOpenReview = () => {
    if (barbershop.googleReviewUrl) {
      window.open(barbershop.googleReviewUrl, '_blank');
    } else {
      window.open(`https://search.google.com/local/writereview`, '_blank');
    }
  };

  return (
    <section className="px-4 py-4">
      <div
        className="rounded-[22px] bg-[#121212] border border-white/[0.08] p-5 space-y-4"
        style={{ borderRadius: 'var(--border-radius)' }}
      >
        {/* Header & Rating Metric */}
        <div className="flex items-center justify-between">
          <div>
            <span
              className="text-[11px] font-bold tracking-wider uppercase"
              style={{ color: 'var(--accent-color)' }}
            >
              Google Reviews
            </span>
            <h3 className="text-xl font-extrabold text-white tracking-tight mt-0.5">
              O que dizem os clientes
            </h3>
          </div>

          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1">
              <span className="text-xl font-black text-white">{barbershop.rating}</span>
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
            </div>
            <span className="text-[10px] text-stone-500 font-medium">
              +{barbershop.reviewCount} avaliações
            </span>
          </div>
        </div>

        {/* Testimonials List */}
        <div className="space-y-2.5">
          {DEFAULT_TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="p-3.5 rounded-xl bg-stone-900/60 border border-white/[0.05] space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">{t.name}</span>
                  {t.verified && (
                    <span className="flex items-center text-[10px] text-emerald-400 gap-0.5">
                      <CheckCircle className="w-3 h-3 fill-emerald-500/20" /> Verificado
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-stone-500">{t.date}</span>
              </div>

              <div className="flex text-amber-400 py-0.5">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-current" />
                ))}
              </div>

              <p className="text-xs text-stone-300 leading-relaxed italic">
                "{t.comment}"
              </p>
            </div>
          ))}
        </div>

        {/* CTA to Review on Google */}
        <button
          onClick={handleOpenReview}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full font-bold text-xs text-white bg-white/[0.08] hover:bg-white/[0.12] border border-white/10 active:scale-[0.98] transition-all cursor-pointer"
          style={{
            borderRadius: 'var(--button-radius)'
          }}
        >
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span>Avalie nossa barbearia no Google</span>
          <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
        </button>
      </div>
    </section>
  );
};
