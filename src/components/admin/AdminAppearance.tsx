import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DEFAULT_THEME_PRESETS } from '../../data/defaultData';
import { Palette, Check, Sparkles, Sliders, Type, Undo2, Sun, Moon } from 'lucide-react';

export const AdminAppearance: React.FC = () => {
  const { theme, updateTheme, setThemePreset, resetToDefaults } = useApp();
  const [saveToast, setSaveToast] = useState(false);

  const fontOptions = [
    { label: 'Outfit (Moderno / Editorial)', value: "'Outfit', sans-serif" },
    { label: 'Plus Jakarta Sans (Limpo / Sofisticado)', value: "'Plus Jakarta Sans', sans-serif" },
    { label: 'Inter (Minimalista / Universal)', value: "'Inter', sans-serif" },
    { label: 'Montserrat (Imponente / Premium)', value: "'Montserrat', sans-serif" },
    { label: 'DM Sans (Clássico Moderno)', value: "'DM Sans', sans-serif" },
    { label: 'Manrope (Geométrico Elegante)', value: "'Manrope', sans-serif" },
    { label: 'Space Grotesk (Tech / Criativo)', value: "'Space Grotesk', sans-serif" },
    { label: 'Syne (Marcante / Design)', value: "'Syne', sans-serif" }
  ];

  const handleSave = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Personalizar Aparência & Visual
          </h2>
          <p className="text-xs text-stone-400">
            Altere paleta de cores, tipografia, cantos arredondados e temas com visualização instantânea
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#A8FF3E] hover:bg-[#97f02d] text-black font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
          >
            {saveToast ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Alterações Salvas!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Salvar Alterações</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Theme Presets Selection */}
      <div className="p-5 rounded-2xl bg-[#141414] border border-white/[0.08] space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
          <Palette className="w-4 h-4 text-[#A8FF3E]" />
          <span>Temas Prontos de Alta Conversão</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {Object.keys(DEFAULT_THEME_PRESETS).map((presetName) => {
            const preset = DEFAULT_THEME_PRESETS[presetName];
            const isSelected = theme.presetName === presetName;

            return (
              <button
                key={presetName}
                onClick={() => setThemePreset(presetName)}
                className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                  isSelected
                    ? 'border-[#A8FF3E] bg-white/[0.06] shadow-lg'
                    : 'border-white/10 bg-stone-900/60 hover:border-white/20'
                }`}
              >
                {/* Color swatches */}
                <div className="flex items-center gap-1.5 mb-2.5">
                  <div
                    className="w-4 h-4 rounded-full border border-white/20"
                    style={{ backgroundColor: preset.backgroundColor }}
                  />
                  <div
                    className="w-4 h-4 rounded-full border border-white/20"
                    style={{ backgroundColor: preset.surfaceColor }}
                  />
                  <div
                    className="w-4 h-4 rounded-full shadow"
                    style={{ backgroundColor: preset.accentColor }}
                  />
                </div>

                <p className="text-xs font-bold text-white truncate">
                  {presetName}
                </p>

                {isSelected && (
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#A8FF3E] flex items-center justify-center text-black">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Detailed Colors Editor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-[#141414] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#A8FF3E]" />
              <span>Cores Customizadas</span>
            </h3>
            <button
              onClick={() => updateTheme({ isDark: !theme.isDark })}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/[0.06] text-xs text-stone-300 hover:text-white"
            >
              {theme.isDark ? <Moon className="w-3.5 h-3.5 text-stone-400" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
              <span>{theme.isDark ? 'Modo Escuro' : 'Modo Claro'}</span>
            </button>
          </div>

          <div className="space-y-3">
            {/* Accent Color */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-900/60 border border-white/[0.05]">
              <div>
                <label className="block text-xs font-semibold text-white">
                  Cor de Destaque / Botões Principais
                </label>
                <span className="text-[10px] text-stone-400">Usada nos CTAs e elementos de conversão</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme.accentColor}
                  onChange={(e) => updateTheme({ accentColor: e.target.value })}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <span className="text-xs font-mono text-stone-300 uppercase">
                  {theme.accentColor}
                </span>
              </div>
            </div>

            {/* Background Color */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-900/60 border border-white/[0.05]">
              <div>
                <label className="block text-xs font-semibold text-white">
                  Cor de Fundo da Página
                </label>
                <span className="text-[10px] text-stone-400">Tela principal do cartão</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme.backgroundColor}
                  onChange={(e) => updateTheme({ backgroundColor: e.target.value })}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <span className="text-xs font-mono text-stone-300 uppercase">
                  {theme.backgroundColor}
                </span>
              </div>
            </div>

            {/* Surface / Card Color */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-900/60 border border-white/[0.05]">
              <div>
                <label className="block text-xs font-semibold text-white">
                  Cor dos Cards & Caixas
                </label>
                <span className="text-[10px] text-stone-400">Superfície interna dos blocos</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme.surfaceColor}
                  onChange={(e) => updateTheme({ surfaceColor: e.target.value, surfaceCard: e.target.value })}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <span className="text-xs font-mono text-stone-300 uppercase">
                  {theme.surfaceColor}
                </span>
              </div>
            </div>

            {/* Text Primary Color */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-900/60 border border-white/[0.05]">
              <div>
                <label className="block text-xs font-semibold text-white">
                  Cor do Texto Principal
                </label>
                <span className="text-[10px] text-stone-400">Títulos e destaques de texto</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme.textPrimary}
                  onChange={(e) => updateTheme({ textPrimary: e.target.value })}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <span className="text-xs font-mono text-stone-300 uppercase">
                  {theme.textPrimary}
                </span>
              </div>
            </div>

            {/* Text Secondary Color */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-900/60 border border-white/[0.05]">
              <div>
                <label className="block text-xs font-semibold text-white">
                  Cor do Texto Secundário
                </label>
                <span className="text-[10px] text-stone-400">Descrições e metadados</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme.textSecondary}
                  onChange={(e) => updateTheme({ textSecondary: e.target.value })}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <span className="text-xs font-mono text-stone-300 uppercase">
                  {theme.textSecondary}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Typography & Geometry Editor */}
        <div className="p-5 rounded-2xl bg-[#141414] border border-white/[0.08] space-y-4">
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <Type className="w-4 h-4 text-[#A8FF3E]" />
            <span>Tipografia & Formas</span>
          </h3>

          <div className="space-y-4">
            {/* Font Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-white">
                Família Tipográfica
              </label>
              <select
                value={theme.fontFamily}
                onChange={(e) => updateTheme({ fontFamily: e.target.value })}
                className="w-full py-2.5 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs font-medium"
              >
                {fontOptions.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Card Border Radius */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-white">
                  Raio dos Cards: {theme.borderRadius}px
                </label>
                <span className="text-[10px] text-stone-400">
                  {theme.borderRadius <= 16 ? 'Cantos mais retos' : theme.borderRadius >= 26 ? 'Ultra arredondado' : 'Equilibrado'}
                </span>
              </div>
              <input
                type="range"
                min={8}
                max={32}
                step={2}
                value={theme.borderRadius}
                onChange={(e) => updateTheme({ borderRadius: Number(e.target.value) })}
                className="w-full accent-[#A8FF3E] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-500">
                <span>8px</span>
                <span>16px</span>
                <span>22px</span>
                <span>32px</span>
              </div>
            </div>

            {/* Button Style / Radius */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-white">
                Estilo dos Botões
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Pílula (Total)', value: 9999 },
                  { label: 'Arredondado', value: 16 },
                  { label: 'Clássico Reto', value: 8 }
                ].map((btn) => (
                  <button
                    key={btn.value}
                    type="button"
                    onClick={() => updateTheme({ buttonRadius: btn.value })}
                    className={`py-2 px-2 text-xs font-semibold rounded-xl border text-center transition-colors cursor-pointer ${
                      theme.buttonRadius === btn.value
                        ? 'border-[#A8FF3E] bg-[#A8FF3E]/10 text-white'
                        : 'border-white/10 bg-stone-900/60 text-stone-400 hover:text-white'
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Interactive Sample Preview Card */}
            <div className="pt-2">
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2">
                Amostra em Tempo Real
              </p>
              <div
                className="p-4 border transition-all"
                style={{
                  backgroundColor: theme.surfaceColor,
                  borderColor: theme.borderColor,
                  borderRadius: `${theme.borderRadius}px`,
                  fontFamily: theme.fontFamily
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold" style={{ color: theme.textPrimary }}>
                    Exemplo de Card do Cliente
                  </span>
                  <span
                    className="text-xs font-extrabold font-mono"
                    style={{ color: theme.accentColor }}
                  >
                    R$ 80,00
                  </span>
                </div>
                <p className="text-xs mb-3" style={{ color: theme.textSecondary }}>
                  Visual com fonte selecionada e cantos calculados.
                </p>
                <button
                  className="w-full py-2 text-xs font-bold text-black transition-transform active:scale-95"
                  style={{
                    backgroundColor: theme.accentColor,
                    borderRadius: `${theme.buttonRadius}px`
                  }}
                >
                  Botão de Agendamento
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
