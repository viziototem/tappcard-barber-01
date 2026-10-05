import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HeroSlide } from '../../types';
import {
  Sliders,
  Plus,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Trash2,
  Edit2,
  RefreshCw,
  Image as ImageIcon,
  Check,
  Sparkles,
  GripVertical,
  Play,
  Pause
} from 'lucide-react';

export const AdminHeroCarousel: React.FC = () => {
  const {
    heroSlides,
    heroSettings,
    addHeroSlide,
    updateHeroSlide,
    deleteHeroSlide,
    toggleHeroSlideVisibility,
    reorderHeroSlides,
    updateHeroSettings,
    openMediaPicker
  } = useApp();

  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // Form states
  const [imageUrl, setImageUrl] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [buttonText, setButtonText] = useState('Agendar horário agora');
  const [buttonLink, setButtonLink] = useState('booking');
  const [overlayEnabled, setOverlayEnabled] = useState(true);

  // Drag and Drop
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  const openCreateModal = () => {
    if (heroSlides.length >= 10) return;
    setEditingSlide(null);
    setImageUrl('/src/assets/images/barbershop_hero_1791211076060.jpg');
    setTitle('Seu estilo começa aqui.');
    setSubtitle('Corte, barba e experiência premium em um só lugar.');
    setButtonText('Agendar horário agora');
    setButtonLink('booking');
    setOverlayEnabled(true);
    setIsModalOpen(true);
  };

  const openEditModal = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setImageUrl(slide.imageUrl);
    setTitle(slide.title || '');
    setSubtitle(slide.subtitle || '');
    setButtonText(slide.buttonText || 'Agendar agora');
    setButtonLink(slide.buttonLink || 'booking');
    setOverlayEnabled(slide.overlayEnabled ?? true);
    setIsModalOpen(true);
  };

  const handleSaveSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) return;

    if (editingSlide) {
      updateHeroSlide(editingSlide.id, {
        imageUrl: imageUrl.trim(),
        title: title.trim() || undefined,
        subtitle: subtitle.trim() || undefined,
        buttonText: buttonText.trim() || undefined,
        buttonLink: buttonLink.trim() || undefined,
        overlayEnabled
      });
    } else {
      addHeroSlide({
        imageUrl: imageUrl.trim(),
        title: title.trim() || undefined,
        subtitle: subtitle.trim() || undefined,
        buttonText: buttonText.trim() || undefined,
        buttonLink: buttonLink.trim() || undefined,
        visible: true,
        overlayEnabled
      });
    }

    setIsModalOpen(false);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleReplaceImage = (slideId: string) => {
    openMediaPicker((newUrl) => {
      updateHeroSlide(slideId, { imageUrl: newUrl });
    });
  };

  const moveUp = (idx: number) => {
    if (idx > 0) reorderHeroSlides(idx, idx - 1);
  };

  const moveDown = (idx: number) => {
    if (idx < heroSlides.length - 1) reorderHeroSlides(idx, idx + 1);
  };

  const handleDragStart = (idx: number) => {
    setDraggedIdx(idx);
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === idx) return;
    reorderHeroSlides(draggedIdx, idx);
    setDraggedIdx(idx);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Banner Principal (Carrossel)
          </h2>
          <p className="text-xs text-stone-400">
            Adicione até 10 imagens com transições automáticas ou utilize um banner fixo único
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold text-stone-400 px-3 py-1.5 rounded-lg bg-stone-900 border border-white/10">
            {heroSlides.length}/10 imagens
          </span>

          <button
            onClick={openCreateModal}
            disabled={heroSlides.length >= 10}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#A8FF3E] hover:bg-[#97f02d] text-black font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-40 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-black stroke-[2.5]" />
            <span>Adicionar ao Carrossel</span>
          </button>
        </div>
      </div>

      {saveToast && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>Carrossel atualizado com sucesso na página pública!</span>
        </div>
      )}

      {/* Carousel Settings Card */}
      <div className="p-5 rounded-2xl bg-[#141414] border border-white/[0.08] space-y-4">
        <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#A8FF3E]" />
          <span>Configurações do Carrossel</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Autoplay toggle */}
          <div className="p-3 rounded-xl bg-stone-900/60 border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">Troca Automática</span>
              <span className="text-[10px] text-stone-400">Autoplay das imagens</span>
            </div>
            <button
              onClick={() => updateHeroSettings({ autoplay: !heroSettings.autoplay })}
              className={`p-2 rounded-lg text-xs font-bold transition-colors ${
                heroSettings.autoplay
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-stone-800 text-stone-500'
              }`}
            >
              {heroSettings.autoplay ? 'Ativado' : 'Pausado'}
            </button>
          </div>

          {/* Interval */}
          <div className="p-3 rounded-xl bg-stone-900/60 border border-white/10 space-y-1">
            <span className="text-xs font-bold text-white block">Tempo de Troca</span>
            <select
              value={heroSettings.interval}
              onChange={(e) => updateHeroSettings({ interval: Number(e.target.value) })}
              className="w-full py-1 px-2 rounded-lg bg-black border border-white/10 text-xs text-white"
            >
              <option value={3000}>3 segundos (Rápido)</option>
              <option value={4000}>4 segundos</option>
              <option value={5000}>5 segundos (Padrão)</option>
              <option value={6000}>6 segundos</option>
              <option value={8000}>8 segundos</option>
              <option value={10000}>10 segundos (Lento)</option>
            </select>
          </div>

          {/* Transition type */}
          <div className="p-3 rounded-xl bg-stone-900/60 border border-white/10 space-y-1">
            <span className="text-xs font-bold text-white block">Efeito de Transição</span>
            <select
              value={heroSettings.transition}
              onChange={(e) => updateHeroSettings({ transition: e.target.value as any })}
              className="w-full py-1 px-2 rounded-lg bg-black border border-white/10 text-xs text-white"
            >
              <option value="fade">Fade Suave</option>
              <option value="zoom">Zoom In / Efeito Editorial</option>
              <option value="slide">Slide Lateral</option>
            </select>
          </div>

          {/* Dots & Pause */}
          <div className="p-3 rounded-xl bg-stone-900/60 border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">Pontos Indicadores</span>
              <span className="text-[10px] text-stone-400">Mostrar bolinhas de navegação</span>
            </div>
            <button
              onClick={() => updateHeroSettings({ showDots: !heroSettings.showDots })}
              className={`p-2 rounded-lg text-xs font-bold transition-colors ${
                heroSettings.showDots
                  ? 'bg-[#A8FF3E]/15 text-[#A8FF3E] border border-[#A8FF3E]/30'
                  : 'bg-stone-800 text-stone-500'
              }`}
            >
              {heroSettings.showDots ? 'Sim' : 'Não'}
            </button>
          </div>
        </div>
      </div>

      {/* Slides Sortable List */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white">
          Imagens do Banner ({heroSlides.length} de 10)
        </h3>

        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
              slide.visible
                ? 'bg-[#141414] border-white/10 hover:border-white/20'
                : 'bg-[#101010] border-white/[0.04] opacity-50'
            }`}
          >
            {/* Thumbnail + info */}
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="cursor-grab active:cursor-grabbing text-stone-500 hover:text-white p-1"
                title="Arraste para alterar a ordem"
              >
                <GripVertical className="w-4 h-4" />
              </div>

              <div className="relative w-20 h-14 rounded-xl overflow-hidden bg-stone-900 border border-white/10 shrink-0">
                <img
                  src={slide.imageUrl}
                  alt={slide.title || 'Slide'}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-black/80 text-white">
                  #{index + 1}
                </span>
              </div>

              <div className="min-w-0">
                <h4 className="text-sm font-bold text-white truncate">
                  {slide.title || 'Sem título (apenas imagem)'}
                </h4>
                {slide.subtitle && (
                  <p className="text-xs text-stone-400 truncate mt-0.5 max-w-sm">
                    {slide.subtitle}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-stone-400 font-medium">
                    Botão: <span className="text-white">{slide.buttonText || 'Padrão'}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 self-end sm:self-center">
              {/* Move Up/Down Controls */}
              <div className="flex items-center bg-white/[0.04] rounded-lg p-0.5 border border-white/5 mr-1">
                <button
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                  className="p-1.5 rounded text-stone-400 hover:text-white disabled:opacity-30 cursor-pointer"
                  title="Mover para cima"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => moveDown(index)}
                  disabled={index === heroSlides.length - 1}
                  className="p-1.5 rounded text-stone-400 hover:text-white disabled:opacity-30 cursor-pointer"
                  title="Mover para baixo"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Replace image with library */}
              <button
                onClick={() => handleReplaceImage(slide.id)}
                className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/10 text-stone-300 hover:text-white transition-colors cursor-pointer"
                title="Trocar imagem da biblioteca"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              {/* Visibility */}
              <button
                onClick={() => toggleHeroSlideVisibility(slide.id)}
                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                  slide.visible
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-stone-800 text-stone-500 border-white/5'
                }`}
                title={slide.visible ? 'Ocultar slide' : 'Exibir slide'}
              >
                {slide.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>

              {/* Edit */}
              <button
                onClick={() => openEditModal(slide)}
                className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/10 text-stone-300 hover:text-white transition-colors cursor-pointer"
                title="Editar textos do slide"
              >
                <Edit2 className="w-4 h-4" />
              </button>

              {/* Delete */}
              <button
                onClick={() => deleteHeroSlide(slide.id)}
                disabled={heroSlides.length <= 1}
                className="p-2 rounded-xl bg-white/[0.05] hover:bg-rose-500/20 text-stone-400 hover:text-rose-400 transition-colors disabled:opacity-20 cursor-pointer"
                title="Excluir slide"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Slide Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#141414] border border-white/15 rounded-2xl p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingSlide ? 'Editar Slide do Carrossel' : 'Novo Slide para o Banner'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSlide} className="space-y-4">
              {/* Image URL & Media Library Picker */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Imagem do Banner *
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="URL da imagem..."
                    className="flex-1 py-2 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      openMediaPicker((url) => setImageUrl(url));
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold shrink-0 cursor-pointer"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-[#A8FF3E]" />
                    <span>Biblioteca</span>
                  </button>
                </div>
              </div>

              {/* Image Preview */}
              {imageUrl && (
                <div className="aspect-[16/9] rounded-xl overflow-hidden bg-stone-900 border border-white/10">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              {/* Text Overlays */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Textos de Sobreposição</span>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-400">
                    <input
                      type="checkbox"
                      checked={overlayEnabled}
                      onChange={(e) => setOverlayEnabled(e.target.checked)}
                      className="accent-[#A8FF3E]"
                    />
                    <span>Exibir textos neste slide</span>
                  </label>
                </div>

                {overlayEnabled && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1">
                        Título de Destaque
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Seu estilo começa aqui."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full py-2 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1">
                        Subtítulo / Descrição
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Ex: Cortes e barba com atendimento exclusivo."
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                        className="w-full py-2 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-stone-300 mb-1">
                          Texto do Botão
                        </label>
                        <input
                          type="text"
                          value={buttonText}
                          onChange={(e) => setButtonText(e.target.value)}
                          className="w-full py-2 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-300 mb-1">
                          Ação do Botão
                        </label>
                        <select
                          value={buttonLink}
                          onChange={(e) => setButtonLink(e.target.value)}
                          className="w-full py-2 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs"
                        >
                          <option value="booking">Abrir Agendamento</option>
                          <option value="services">Rolar até Serviços</option>
                          <option value="whatsapp">Abrir WhatsApp</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#A8FF3E] text-black font-bold text-xs shadow-md"
                >
                  Salvar Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
