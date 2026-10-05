import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DaySchedule, TimePeriod } from '../../types';
import {
  Clock,
  Plus,
  Trash2,
  Check,
  Sparkles,
  AlertCircle,
  CalendarCheck
} from 'lucide-react';

export const AdminBusinessHours: React.FC = () => {
  const {
    weeklySchedule,
    updateWeeklySchedule,
    isBusinessOpen,
    statusBadgeText,
    nextOpeningInfo
  } = useApp();

  const [schedule, setSchedule] = useState<DaySchedule[]>(weeklySchedule);
  const [saveToast, setSaveToast] = useState(false);

  const toggleDay = (dayIndex: number) => {
    setSchedule(prev => prev.map(d => {
      if (d.dayIndex === dayIndex) {
        const nextEnabled = !d.enabled;
        return {
          ...d,
          enabled: nextEnabled,
          closedAllDay: !nextEnabled,
          periods: nextEnabled && d.periods.length === 0 ? [{ opening: '09:00', closing: '19:00' }] : d.periods
        };
      }
      return d;
    }));
  };

  const handlePeriodChange = (
    dayIndex: number,
    periodIndex: number,
    key: 'opening' | 'closing',
    value: string
  ) => {
    setSchedule(prev => prev.map(d => {
      if (d.dayIndex === dayIndex) {
        const updatedPeriods = [...d.periods];
        updatedPeriods[periodIndex] = {
          ...updatedPeriods[periodIndex],
          [key]: value
        };
        return { ...d, periods: updatedPeriods };
      }
      return d;
    }));
  };

  const addPeriod = (dayIndex: number) => {
    setSchedule(prev => prev.map(d => {
      if (d.dayIndex === dayIndex) {
        return {
          ...d,
          periods: [...d.periods, { opening: '14:00', closing: '20:00' }]
        };
      }
      return d;
    }));
  };

  const removePeriod = (dayIndex: number, periodIndex: number) => {
    setSchedule(prev => prev.map(d => {
      if (d.dayIndex === dayIndex) {
        const remaining = d.periods.filter((_, i) => i !== periodIndex);
        return {
          ...d,
          periods: remaining,
          closedAllDay: remaining.length === 0,
          enabled: remaining.length > 0
        };
      }
      return d;
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateWeeklySchedule(schedule);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Horário de Funcionamento & Status Automático
          </h2>
          <p className="text-xs text-stone-400">
            Configure turnos por dia da semana. O sistema determina automaticamente se a barbearia está aberta ou fechada
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#A8FF3E] hover:bg-[#97f02d] text-black font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
        >
          {saveToast ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Horários Salvos!</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Salvar Horários</span>
            </>
          )}
        </button>
      </div>

      {/* Live Status Calculation Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-stone-900 via-[#151515] to-[#121212] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-3.5 h-3.5 rounded-full shrink-0 ${
              isBusinessOpen
                ? 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)] animate-pulse'
                : 'bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.5)]'
            }`}
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">Status em Tempo Real:</span>
              <span className={`text-xs font-extrabold uppercase ${isBusinessOpen ? 'text-emerald-400' : 'text-amber-400'}`}>
                {statusBadgeText}
              </span>
            </div>
            <p className="text-[11px] text-stone-400 mt-0.5">
              {nextOpeningInfo}
            </p>
          </div>
        </div>

        <span className="text-[10px] text-stone-500 font-mono">
          Cálculo sincronizado com horário local
        </span>
      </div>

      {/* Days Schedule List */}
      <div className="space-y-3">
        {schedule.map((day) => (
          <div
            key={day.dayIndex}
            className={`p-4 rounded-2xl border transition-all ${
              day.enabled && !day.closedAllDay
                ? 'bg-[#141414] border-white/10'
                : 'bg-[#101010] border-white/[0.04] opacity-60'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              {/* Day title & switch */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => toggleDay(day.dayIndex)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    day.enabled && !day.closedAllDay
                      ? 'bg-[#A8FF3E] text-black shadow-sm'
                      : 'bg-stone-800 text-stone-500 border border-white/5'
                  }`}
                >
                  {day.enabled && !day.closedAllDay ? 'Aberto' : 'Fechado'}
                </button>

                <div>
                  <h4 className="text-sm font-bold text-white">
                    {day.dayName}
                  </h4>
                  <span className="text-[10px] text-stone-400">
                    {day.enabled && !day.closedAllDay
                      ? `${day.periods.length} período(s) de atendimento`
                      : 'Fechado o dia todo'}
                  </span>
                </div>
              </div>

              {/* Periods of day */}
              {day.enabled && !day.closedAllDay && (
                <div className="flex flex-wrap items-center gap-2">
                  {day.periods.map((period, pIdx) => (
                    <div
                      key={pIdx}
                      className="flex items-center gap-1.5 p-1.5 rounded-xl bg-stone-900 border border-white/10"
                    >
                      <input
                        type="time"
                        value={period.opening}
                        onChange={(e) =>
                          handlePeriodChange(day.dayIndex, pIdx, 'opening', e.target.value)
                        }
                        className="py-1 px-2 rounded-lg bg-black text-white text-xs font-mono border-0 focus:outline-none"
                      />
                      <span className="text-xs text-stone-500 font-bold">às</span>
                      <input
                        type="time"
                        value={period.closing}
                        onChange={(e) =>
                          handlePeriodChange(day.dayIndex, pIdx, 'closing', e.target.value)
                        }
                        className="py-1 px-2 rounded-lg bg-black text-white text-xs font-mono border-0 focus:outline-none"
                      />

                      {day.periods.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePeriod(day.dayIndex, pIdx)}
                          className="p-1 text-stone-500 hover:text-rose-400"
                          title="Remover turno"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addPeriod(day.dayIndex)}
                    className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/10 text-stone-300 text-xs font-medium cursor-pointer"
                    title="Adicionar segundo turno (ex: tarde/noite)"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Turno</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
