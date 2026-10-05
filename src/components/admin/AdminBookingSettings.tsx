import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  MessageCircle,
  Clock,
  Users,
  Calendar,
  Check,
  Sparkles,
  Download,
  Upload,
  RotateCcw,
  AlertTriangle
} from 'lucide-react';

export const AdminBookingSettings: React.FC = () => {
  const {
    bookingSettings,
    updateBookingSettings,
    resetToDefaults,
    exportDataJSON,
    importDataJSON
  } = useApp();

  const [formData, setFormData] = useState(bookingSettings);
  const [saveToast, setSaveToast] = useState(false);
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState(false);

  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const toggleDay = (day: string) => {
    const current = formData.daysOpen || [];
    const updated = current.includes(day)
      ? current.filter(d => d !== day)
      : [...current, day];
    setFormData(prev => ({ ...prev, daysOpen: updated }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateBookingSettings(formData);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleExport = () => {
    const jsonStr = exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `barbershop-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const ok = importDataJSON(content);
      if (ok) {
        setImportSuccess(true);
        setImportError('');
        setTimeout(() => setImportSuccess(false), 3000);
      } else {
        setImportError('Arquivo JSON inválido ou corrompido.');
      }
    };
    reader.readAsText(file);
  };

  const insertVariable = (variable: string) => {
    setFormData(prev => ({
      ...prev,
      messageTemplate: prev.messageTemplate + variable
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Configurações de Agendamento & WhatsApp
          </h2>
          <p className="text-xs text-stone-400">
            Ajuste horários de atendimento, capacidade e personalize o texto automático
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#A8FF3E] hover:bg-[#97f02d] text-black font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
        >
          {saveToast ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Salvo com sucesso!</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Salvar Configurações</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* WhatsApp & Schedule Rules */}
        <div className="p-5 rounded-2xl bg-[#141414] border border-white/[0.08] space-y-4">
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#A8FF3E]" />
            <span>Regras de Horários & Pessoas</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Número do WhatsApp que Recebe os Agendamentos
              </label>
              <input
                type="text"
                placeholder="5511999998888"
                value={formData.whatsappNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                className="w-full py-2.5 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs"
              />
              <span className="text-[10px] text-stone-500">
                Formato internacional com DDI 55 (Brasil) e DDD sem espaços ou traços.
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Horário de Início
                </label>
                <input
                  type="time"
                  value={formData.openingTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, openingTime: e.target.value }))}
                  className="w-full py-2.5 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Horário de Encerramento
                </label>
                <input
                  type="time"
                  value={formData.closingTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, closingTime: e.target.value }))}
                  className="w-full py-2.5 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Intervalo entre Horários
                </label>
                <select
                  value={formData.intervalMinutes}
                  onChange={(e) => setFormData(prev => ({ ...prev, intervalMinutes: Number(e.target.value) }))}
                  className="w-full py-2.5 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs"
                >
                  <option value={15}>A cada 15 minutos</option>
                  <option value={30}>A cada 30 minutos (Padrão)</option>
                  <option value={45}>A cada 45 minutos</option>
                  <option value={60}>A cada 1 hora</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Capacidade Máx. por Agendamento
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={formData.maxPeople}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxPeople: Number(e.target.value) }))}
                  className="w-full py-2.5 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-2">
                Dias de Atendimento na Semana
              </label>
              <div className="flex flex-wrap gap-1.5">
                {daysOfWeek.map((day) => {
                  const isChecked = (formData.daysOpen || []).includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-[#A8FF3E] text-black shadow-sm'
                          : 'bg-stone-900 text-stone-500 border border-white/5'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp Message Template */}
        <div className="p-5 rounded-2xl bg-[#141414] border border-white/[0.08] space-y-4">
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-[#A8FF3E]" />
            <span>Mensagem Pronta do WhatsApp</span>
          </h3>

          <p className="text-xs text-stone-400">
            Esta é a mensagem que será preenchida automaticamente no WhatsApp do cliente ao clicar em confirmar:
          </p>

          <div className="space-y-2">
            <textarea
              rows={6}
              value={formData.messageTemplate}
              onChange={(e) => setFormData(prev => ({ ...prev, messageTemplate: e.target.value }))}
              className="w-full py-2.5 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs font-mono leading-relaxed"
            />

            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-stone-400">
                Inserir variáveis dinâmicas:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  '{barbershop_name}',
                  '{customer_name}',
                  '{date}',
                  '{time}',
                  '{people}',
                  '{service}',
                  '{notes}'
                ].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => insertVariable(` ${v} `)}
                    className="px-2 py-1 rounded bg-white/[0.06] hover:bg-white/10 text-stone-300 font-mono text-[10px] cursor-pointer"
                  >
                    + {v}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Backup, Import & Factory Reset */}
      <div className="p-5 rounded-2xl bg-[#141414] border border-white/[0.08] space-y-4">
        <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
          <Settings className="w-4 h-4 text-[#A8FF3E]" />
          <span>Backup & Manutenção do Sistema</span>
        </h3>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-1">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-white">
              Exportar ou Importar Configurações
            </p>
            <p className="text-[11px] text-stone-400">
              Faça download de todas as personalizações ou restaure um backup em JSON.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.08] hover:bg-white/15 text-xs text-white font-medium transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar JSON</span>
            </button>

            <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.08] hover:bg-white/15 text-xs text-white font-medium transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Importar JSON</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={() => {
                if (window.confirm('Tem certeza que deseja restaurar as configurações padrão de fábrica da barbearia?')) {
                  resetToDefaults();
                  window.location.reload();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-xs text-rose-400 font-medium transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar Padrão</span>
            </button>
          </div>
        </div>

        {importSuccess && (
          <p className="text-xs text-emerald-400">Backup importado com sucesso!</p>
        )}
        {importError && (
          <p className="text-xs text-rose-400">{importError}</p>
        )}
      </div>
    </div>
  );
};
