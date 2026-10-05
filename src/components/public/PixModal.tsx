import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QrCode, Copy, Check, X, ShieldCheck } from 'lucide-react';

export const PixModal: React.FC = () => {
  const { activeSpecialModal, closeSpecialModal, pix, activeSpecialData } = useApp();
  const [copied, setCopied] = useState(false);

  if (activeSpecialModal !== 'pix') return null;

  const currentPix = activeSpecialData || pix;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentPix.key || '');
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
              <QrCode className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight leading-tight">
                Pagamento via PIX
              </h3>
              <p className="text-[11px] text-stone-400">
                Transfira com rapidez e segurança
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

        {/* PIX Key Details */}
        <div className="p-4 rounded-xl bg-stone-900/80 border border-white/10 space-y-3">
          {currentPix.recipientName && (
            <div>
              <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block">
                Favorecido
              </span>
              <p className="text-xs font-bold text-white mt-0.5">
                {currentPix.recipientName}
              </p>
            </div>
          )}

          <div>
            <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block">
              {currentPix.description || 'Chave PIX'}
            </span>
            <div className="flex items-center justify-between mt-1 p-2.5 rounded-lg bg-black/50 border border-white/10">
              <span className="text-xs sm:text-sm font-bold text-[#A8FF3E] font-mono truncate mr-2 select-all">
                {currentPix.key || '11987654321'}
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors shrink-0 cursor-pointer"
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
              <span>Chave PIX Copiada com Sucesso!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-black stroke-[2.5]" />
              <span>Copiar Chave PIX</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
