import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Wifi, Copy, Check, X, ShieldCheck } from 'lucide-react';

export const WifiModal: React.FC = () => {
  const { activeSpecialModal, closeSpecialModal, wifi, activeSpecialData } = useApp();
  const [copied, setCopied] = useState(false);

  if (activeSpecialModal !== 'wifi') return null;

  const currentWifi = activeSpecialData || wifi;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentWifi.password || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-sm bg-[#141414] border border-white/15 rounded-t-[26px] sm:rounded-[26px] p-6 shadow-2xl space-y-5 animate-slideUp"
        style={{ borderRadius: 'var(--border-radius)' }}
      >
        {/* Grab bar for mobile */}
        <div className="w-12 h-1 bg-stone-700 rounded-full mx-auto -mt-2 mb-2 sm:hidden" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-black font-bold shadow-lg"
              style={{ backgroundColor: 'var(--accent-color)' }}
            >
              <Wifi className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight leading-tight">
                Wi-Fi de Alta Velocidade
              </h3>
              <p className="text-[11px] text-stone-400">
                Conecte-se gratuitamente enquanto aguarda
              </p>
            </div>
          </div>

          <button
            onClick={closeSpecialModal}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/[0.06] hover:bg-white/10 text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Network & Password Card */}
        <div className="p-4 rounded-xl bg-stone-900/80 border border-white/10 space-y-3">
          <div>
            <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block">
              Nome da Rede (SSID)
            </span>
            <p className="text-sm font-extrabold text-white mt-0.5 font-mono">
              {currentWifi.networkName || 'BarberShop_Imperial_5G'}
            </p>
          </div>

          <div className="pt-2 border-t border-white/[0.08]">
            <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block">
              Senha de Acesso
            </span>
            <div className="flex items-center justify-between mt-1 p-2.5 rounded-lg bg-black/50 border border-white/10">
              <span className="text-sm font-bold text-[#A8FF3E] font-mono tracking-wider">
                {currentWifi.password || 'navalhaeestilo'}
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                    <span className="text-emerald-400">Copiada!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-stone-300" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleCopy}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-full font-bold text-sm text-black transition-all active:scale-95 shadow-lg cursor-pointer"
          style={{
            backgroundColor: 'var(--accent-color)',
            borderRadius: 'var(--button-radius)'
          }}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-black stroke-[3]" />
              <span>Senha copiada para transferência!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-black stroke-[2.5]" />
              <span>Copiar Senha do Wi-Fi</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
