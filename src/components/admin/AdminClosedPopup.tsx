import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Clock,
  Sparkles,
  Check,
  AlertCircle,
  Eye,
  Sliders,
  Calendar,
  X
} from 'lucide-react';

export const AdminClosedPopup: React.FC = () => {
  const { closedPopup, updateClosedPopup, nextOpeningInfo } = useApp();
  const [saveToast, setSaveToast] = useState(false);

  const [formData, setFormData] = useState(closedPopup);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateClosedPopup(formData);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Aviso de Barbearia Fechada (Popup & Badges)
          </h2>
          <p className="text-xs text-stone-400">
            Configure o aviso não-bloqueante exibido quando o visitante acessa o cartão fora do expediente
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const nextEnabled = !formData.enabled;
              setFormData(prev => ({ ...prev, enabled: nextEnabled }));
              updateClosedPopup({ enabled: nextEnabled });
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              formData.enabled
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                : 'bg-stone-800 border-white/5 text-stone-400'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${formData.enabled ? 'bg-amber-400' : 'bg-stone-500'}`} />
            <span>{formData.enabled ? 'Popup Ativo' : 'Popup Desativado'}</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#A8FF3E] hover:bg-[#97f02d] text-black font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
          >
            {saveToast ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Salvo!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Salvar Configurações</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Form */}
        <form onSubmit={handleSave} className="p-5 rounded-2xl bg-[#141414] border border-white/[0.08] space-y-4">
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#A8FF3E]" />
            <span>Textos e Opções de Exibição</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Título do Aviso
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full py-2 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Mensagem Explicativa
              </label>
              <textarea
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                className="w-full py-2 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Texto do Botão de Agendamento
              </label>
              <input
                type="text"
                value={formData.buttonText}
                onChange={(e) => setFormData(prev => ({ ...prev, buttonText: e.target.value }))}
                className="w-full py-2 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Texto "Aberto" (Badge)
                </label>
                <input
                  type="text"
                  value={formData.openLabel}
                  onChange={(e) => setFormData(prev => ({ ...prev, openLabel: e.target.value }))}
                  className="w-full py-2 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Texto "Fechado" (Badge)
                </label>
                <input
                  type="text"
                  value={formData.closedLabel}
                  onChange={(e) => setFormData(prev => ({ ...prev, closedLabel: e.target.value }))}
                  className="w-full py-2 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-300">
                <input
                  type="checkbox"
                  checked={formData.showStatusIndicator}
                  onChange={(e) => setFormData(prev => ({ ...prev, showStatusIndicator: e.target.checked }))}
                  className="accent-[#A8FF3E]"
                />
                <span>Exibir selo de status no topo do cartão público</span>
              </label>
            </div>
          </div>
        </form>

        {/* Live Simulation Preview */}
        <div className="p-5 rounded-2xl bg-[#141414] border border-white/[0.08] space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#A8FF3E]" />
              <span>Simulação do Popup no Smartphone</span>
            </h3>
            <span className="text-[10px] text-amber-400 font-mono font-bold">Modo Não-Bloqueante</span>
          </div>

          <div className="p-5 rounded-2xl bg-black/60 border border-amber-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider block">Aviso</span>
                  <h4 className="text-sm font-bold text-white">{formData.title}</h4>
                </div>
              </div>
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-stone-400">
                <X className="w-3 h-3" />
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-200">
              {nextOpeningInfo}
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">
              {formData.message}
            </p>

            <button
              type="button"
              className="w-full py-2.5 px-3 rounded-full bg-[#A8FF3E] text-black font-bold text-xs flex items-center justify-center gap-2 shadow"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{formData.buttonText}</span>
            </button>
            <p className="text-center text-[10px] text-stone-500">
              Entendi, quero explorar o cartão
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
