import React from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, Calendar, X, AlertCircle, Sparkles } from 'lucide-react';

export const ClosedNoticePopup: React.FC = () => {
  const {
    isBusinessOpen,
    closedPopup,
    nextOpeningInfo,
    isClosedPopupDismissed,
    dismissClosedPopup,
    openBookingModal,
    barbershop
  } = useApp();

  // If business is open, or popup disabled, or user already dismissed, do not render
  if (isBusinessOpen || !closedPopup.enabled || isClosedPopupDismissed) {
    return null;
  }

  return (
    <div
      onClick={dismissClosedPopup}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm transition-opacity animate-fadeIn"
    >
      {/* Modal Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm bg-[#141414] border-t sm:border border-amber-500/20 rounded-t-[26px] sm:rounded-[26px] p-6 shadow-2xl space-y-4 animate-slideUp"
        style={{ borderRadius: 'var(--border-radius)' }}
      >
        {/* Grab Handle for Mobile */}
        <div className="w-12 h-1 bg-stone-700 rounded-full mx-auto -mt-2 mb-2 sm:hidden" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-wider text-amber-400 uppercase">
                Aviso de Atendimento
              </span>
              <h3 className="text-base font-extrabold text-white tracking-tight leading-tight">
                {closedPopup.title || 'Barbearia fechada no momento'}
              </h3>
            </div>
          </div>

          <button
            onClick={dismissClosedPopup}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/[0.06] hover:bg-white/10 text-stone-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Fechar aviso"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Next Opening Highlight Card */}
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
          <p className="text-xs font-semibold text-amber-200">
            {nextOpeningInfo}
          </p>
        </div>

        <p className="text-xs text-stone-300 leading-relaxed">
          {closedPopup.message ||
            'No momento estamos fechados. Você ainda pode conhecer nossos serviços e deixar seu agendamento preparado para o próximo horário disponível!'}
        </p>

        {/* Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={() => {
              dismissClosedPopup();
              openBookingModal();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full font-bold text-xs text-black transition-all active:scale-95 shadow-lg cursor-pointer"
            style={{
              backgroundColor: 'var(--accent-color)',
              borderRadius: 'var(--button-radius)'
            }}
          >
            <Calendar className="w-4 h-4 text-black stroke-[2.5]" />
            <span>{closedPopup.buttonText || 'Agendar horário para amanhã'}</span>
          </button>

          <button
            onClick={dismissClosedPopup}
            className="w-full py-2.5 text-center text-xs text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            Entendi, quero explorar o cartão
          </button>
        </div>
      </div>
    </div>
  );
};
