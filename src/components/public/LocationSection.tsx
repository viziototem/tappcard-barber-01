import React from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, Navigation, MapPin, ExternalLink, Car } from 'lucide-react';

export const LocationSection: React.FC = () => {
  const { barbershop, trackMetric } = useApp();

  const handleOpenMaps = () => {
    trackMetric('mapsClicks');
    if (barbershop.googleMapsUrl) {
      window.open(barbershop.googleMapsUrl, '_blank');
    } else {
      const query = encodeURIComponent(`${barbershop.name} ${barbershop.address} ${barbershop.city}`);
      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
    }
  };

  const handleOpenWaze = () => {
    const query = encodeURIComponent(`${barbershop.address}, ${barbershop.city}`);
    window.open(`https://waze.com/ul?q=${query}`, '_blank');
  };

  const handleOpenUber = () => {
    const query = encodeURIComponent(`${barbershop.address}, ${barbershop.city}`);
    window.open(`https://m.uber.com/ul/?action=setPickup&dropoff[formatted_address]=${query}`, '_blank');
  };

  return (
    <section className="px-4 py-4">
      <div
        className="rounded-[22px] bg-[#121212] border border-white/[0.08] p-5 space-y-4"
        style={{ borderRadius: 'var(--border-radius)' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <span
              className="text-[11px] font-bold tracking-wider uppercase"
              style={{ color: 'var(--accent-color)' }}
            >
              Fácil Acesso
            </span>
            <h3 className="text-xl font-extrabold text-white tracking-tight mt-0.5">
              Onde Estamos
            </h3>
          </div>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/[0.05]">
            <MapPin className="w-4 h-4 text-stone-300" />
          </div>
        </div>

        {/* Address card */}
        <div className="p-3.5 rounded-xl bg-stone-900/80 border border-white/[0.06] space-y-1">
          <p className="text-sm font-semibold text-white">
            {barbershop.address}
          </p>
          <p className="text-xs text-stone-400">
            {barbershop.neighborhood} · {barbershop.city}
          </p>
        </div>

        {/* Simulated Stylized Dark Map Frame */}
        <div
          onClick={handleOpenMaps}
          className="relative w-full aspect-[16/9] rounded-[16px] overflow-hidden border border-white/10 cursor-pointer group bg-[#1a1e24]"
        >
          {/* Stylized vector map grid background */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#3a4556_1px,transparent_1px)] [background-size:16px_16px]" />
          <svg className="absolute inset-0 w-full h-full opacity-30 stroke-stone-600" fill="none">
            <path d="M 0 50 Q 120 70 200 40 T 400 90" strokeWidth="3" />
            <path d="M 50 0 Q 70 120 180 180" strokeWidth="2" />
            <path d="M 220 0 L 220 200" strokeWidth="4" className="stroke-stone-700" />
            <path d="M 0 110 L 400 110" strokeWidth="3" className="stroke-stone-700" />
          </svg>

          {/* Central Map Pin with Pulse */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center">
              <span
                className="absolute w-10 h-10 rounded-full animate-ping opacity-30"
                style={{ backgroundColor: 'var(--accent-color)' }}
              />
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-black font-bold shadow-xl z-10"
                style={{ backgroundColor: 'var(--accent-color)' }}
              >
                <MapPin className="w-5 h-5 text-black fill-current" />
              </div>
            </div>
            <div className="mt-2 px-2.5 py-1 rounded-full bg-black/85 backdrop-blur-md border border-white/20 text-[11px] font-bold text-white shadow-lg">
              {barbershop.name}
            </div>
          </div>

          {/* Tap to open overlay */}
          <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] text-stone-300 font-medium">
            <span>Toque para abrir rota</span>
            <ExternalLink className="w-3 h-3 text-stone-400" />
          </div>
        </div>

        {/* Operating Hours Table */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-300 mb-1">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            <span>Horários de Atendimento</span>
          </div>

          <div className="space-y-1.5">
            {barbershop.openingHours.map((slot, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-white/[0.02] border border-white/[0.04]"
              >
                <span className="text-stone-300">{slot.days}</span>
                <span className="font-semibold text-white">{slot.hours}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Primary and Navigation CTAs */}
        <div className="space-y-2 pt-2">
          <button
            onClick={handleOpenMaps}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 font-bold text-xs text-black rounded-full transition-all active:scale-[0.98] shadow-md cursor-pointer"
            style={{
              backgroundColor: 'var(--accent-color)',
              borderRadius: 'var(--button-radius)'
            }}
          >
            <Navigation className="w-4 h-4 text-black stroke-[2.5]" />
            <span>Como Chegar (Google Maps)</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleOpenWaze}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white/[0.05] hover:bg-white/10 text-xs font-semibold text-white border border-white/10 active:scale-95 transition-all cursor-pointer"
            >
              <span>Abrir no Waze</span>
            </button>
            <button
              onClick={handleOpenUber}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white/[0.05] hover:bg-white/10 text-xs font-semibold text-white border border-white/10 active:scale-95 transition-all cursor-pointer"
            >
              <Car className="w-3.5 h-3.5 text-stone-400" />
              <span>Pedir Uber</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
