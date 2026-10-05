import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, ChevronDown, Check, Sparkles } from 'lucide-react';
import { ServiceItem } from '../../types';

export const ServicesSection: React.FC = () => {
  const { services, openBookingModal } = useApp();
  const [expandedId, setExpandedId] = useState<string | null>(services[0]?.id || null);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const activeServices = services.filter(s => s.active);

  return (
    <section id="services-section" className="px-4 py-4">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3.5 px-1">
        <div>
          <h3 className="text-base font-bold tracking-tight text-white">
            Nossos Serviços
          </h3>
          <p className="text-xs text-stone-400">
            Técnica artesanal, conforto e precisão
          </p>
        </div>
        <span className="text-xs font-medium text-stone-500">
          {activeServices.length} opções
        </span>
      </div>

      {/* Services List */}
      <div className="space-y-3">
        {activeServices.map((service) => {
          const isExpanded = expandedId === service.id;

          return (
            <div
              key={service.id}
              className={`rounded-[20px] transition-all duration-300 border overflow-hidden ${
                isExpanded
                  ? 'bg-[#181818] border-white/20 shadow-xl'
                  : 'bg-[#121212] border-white/[0.08] hover:border-white/15'
              }`}
              style={{
                borderRadius: 'calc(var(--border-radius) - 2px)'
              }}
            >
              {/* Collapsed Header / Trigger */}
              <div
                onClick={() => toggleExpand(service.id)}
                className="flex items-center gap-3 p-3.5 cursor-pointer select-none"
              >
                {/* Service Thumbnail */}
                <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-stone-900 border border-white/10">
                  <img
                    src={service.imageUrl || '/src/assets/images/barber_cut_service_1791211088254.jpg'}
                    alt={service.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  {service.badge && (
                    <div
                      className="absolute top-0 right-0 left-0 text-[8px] font-bold text-black text-center py-0.5 tracking-tighter truncate px-0.5"
                      style={{ backgroundColor: 'var(--accent-color)' }}
                    >
                      {service.badge}
                    </div>
                  )}
                </div>

                {/* Info Center */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-sm font-bold text-white truncate">
                      {service.name}
                    </h4>
                    <span
                      className="text-sm font-extrabold shrink-0"
                      style={{ color: 'var(--accent-color)' }}
                    >
                      R$ {service.price.toFixed(0)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-1 text-xs text-stone-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-stone-500" />
                      {service.durationMinutes} min
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="truncate text-stone-400">
                      {service.description.substring(0, 36)}...
                    </span>
                  </div>
                </div>

                {/* Expand Indicator */}
                <div className="shrink-0 pl-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center bg-white/[0.05] transition-transform duration-300 ${isExpanded ? 'rotate-180 bg-white/10' : ''}`}>
                    <ChevronDown className="w-4 h-4 text-stone-400" />
                  </div>
                </div>
              </div>

              {/* Expanded Details Body */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-white/[0.06] space-y-3 animate-fadeIn">
                  <p className="text-xs text-stone-300 leading-relaxed pt-2">
                    {service.description}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2 text-xs text-stone-400">
                      <span className="flex items-center gap-1 font-medium text-stone-300">
                        <Check className="w-3.5 h-3.5 text-[#A8FF3E]" /> Atendimento personalizado
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openBookingModal(service.name);
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs text-black active:scale-95 transition-all shadow-md cursor-pointer"
                      style={{
                        backgroundColor: 'var(--accent-color)',
                        borderRadius: 'var(--button-radius)'
                      }}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-black" />
                      <span>Agendar este</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
