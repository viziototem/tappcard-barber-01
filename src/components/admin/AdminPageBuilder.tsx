import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PageSection, SectionType } from '../../types';
import {
  Layers,
  Plus,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Trash2,
  Edit2,
  GripVertical,
  Check,
  Sparkles,
  Scissors,
  MapPin,
  Star,
  BookOpen,
  Instagram,
  Compass,
  MessageCircle
} from 'lucide-react';

export const AdminPageBuilder: React.FC = () => {
  const {
    sections,
    addSection,
    updateSection,
    deleteSection,
    duplicateSection,
    toggleSectionVisibility,
    reorderSections
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<PageSection | null>(null);
  const [saveToast, setSaveToast] = useState(false);

  // Form State for Section
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [buttonText, setButtonText] = useState('');
  const [buttonUrl, setButtonUrl] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#141414');

  // Drag and Drop state
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  const getSectionIcon = (type: SectionType) => {
    switch (type) {
      case 'hero':
        return Compass;
      case 'quick_links':
        return MessageCircle;
      case 'services':
        return Scissors;
      case 'story':
        return BookOpen;
      case 'location':
        return MapPin;
      case 'instagram_feed':
        return Instagram;
      case 'google_reviews':
        return Star;
      case 'custom':
      default:
        return Sparkles;
    }
  };

  const openNewCustomModal = () => {
    setEditingSection(null);
    setTitle('Nova Seção de Destaque');
    setSubtitle('Novidade na barbearia');
    setDescription('Descreva uma promoção, lançamento ou aviso especial para seus clientes.');
    setImageUrl('/src/assets/images/barbershop_hero_1791211076060.jpg');
    setButtonText('Aproveitar Oferta');
    setButtonUrl('');
    setBackgroundColor('#141414');
    setIsModalOpen(true);
  };

  const openEditModal = (sec: PageSection) => {
    setEditingSection(sec);
    setTitle(sec.title);
    setSubtitle(sec.settings?.subtitle || '');
    setDescription(sec.settings?.description || '');
    setImageUrl(sec.settings?.imageUrl || '');
    setButtonText(sec.settings?.buttonText || '');
    setButtonUrl(sec.settings?.buttonUrl || '');
    setBackgroundColor(sec.settings?.backgroundColor || '#141414');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingSection) {
      updateSection(editingSection.id, {
        title: title.trim(),
        settings: {
          ...editingSection.settings,
          subtitle: subtitle.trim() || undefined,
          description: description.trim() || undefined,
          imageUrl: imageUrl.trim() || undefined,
          buttonText: buttonText.trim() || undefined,
          buttonUrl: buttonUrl.trim() || undefined,
          backgroundColor
        }
      });
    } else {
      addSection({
        title: title.trim(),
        type: 'custom',
        visible: true,
        canDelete: true,
        settings: {
          subtitle: subtitle.trim() || undefined,
          description: description.trim() || undefined,
          imageUrl: imageUrl.trim() || undefined,
          buttonText: buttonText.trim() || undefined,
          buttonUrl: buttonUrl.trim() || undefined,
          backgroundColor
        }
      });
    }

    setIsModalOpen(false);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const moveUp = (idx: number) => {
    if (idx > 0) {
      reorderSections(idx, idx - 1);
    }
  };

  const moveDown = (idx: number) => {
    if (idx < sections.length - 1) {
      reorderSections(idx, idx + 1);
    }
  };

  const handleDragStart = (idx: number) => {
    setDraggedIdx(idx);
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === idx) return;
    reorderSections(draggedIdx, idx);
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
            Construtor da Página Inicial
          </h2>
          <p className="text-xs text-stone-400">
            Defina quais blocos aparecem e arraste para alterar a ordem no cartão digital
          </p>
        </div>

        <button
          onClick={openNewCustomModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#A8FF3E] hover:bg-[#97f02d] text-black font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-black stroke-[2.5]" />
          <span>Adicionar Bloco Customizado</span>
        </button>
      </div>

      {saveToast && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>Ordem e seções atualizadas na página pública!</span>
        </div>
      )}

      {/* Sections List */}
      <div className="space-y-2.5">
        {sections.map((sec, index) => {
          const IconComp = getSectionIcon(sec.type);

          return (
            <div
              key={sec.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                sec.visible
                  ? 'bg-[#141414] border-white/10 hover:border-white/20'
                  : 'bg-[#101010] border-white/[0.04] opacity-50'
              }`}
            >
              {/* Drag handle + Section info */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="cursor-grab active:cursor-grabbing text-stone-500 hover:text-white p-1"
                  title="Arraste para mover de posição"
                >
                  <GripVertical className="w-4 h-4" />
                </div>

                <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0">
                  <IconComp className="w-5 h-5 text-white" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono text-stone-500">
                      #{index + 1}
                    </span>
                    <h4 className="text-sm font-bold text-white truncate">
                      {sec.title}
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.05] text-stone-400 uppercase">
                      {sec.type}
                    </span>
                    {sec.visible ? (
                      <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                        ● Visível
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-stone-500">
                        ○ Oculto
                      </span>
                    )}
                  </div>
                  {sec.settings?.description && (
                    <p className="text-xs text-stone-400 truncate mt-0.5 max-w-md">
                      {sec.settings.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions: Move Up, Move Down, Toggle Visibility, Edit, Delete */}
              <div className="flex items-center gap-1.5 self-end sm:self-center">
                {/* Move Controls */}
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
                    disabled={index === sections.length - 1}
                    className="p-1.5 rounded text-stone-400 hover:text-white disabled:opacity-30 cursor-pointer"
                    title="Mover para baixo"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Visibility Toggle */}
                <button
                  onClick={() => toggleSectionVisibility(sec.id)}
                  className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                    sec.visible
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-stone-800 text-stone-500 border-white/5'
                  }`}
                  title={sec.visible ? 'Ocultar bloco' : 'Exibir bloco'}
                >
                  {sec.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>

                {/* Edit Title & Custom Settings */}
                <button
                  onClick={() => openEditModal(sec)}
                  className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/10 text-stone-300 hover:text-white transition-colors cursor-pointer"
                  title="Editar bloco"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                {/* Delete (only for custom sections) */}
                {sec.canDelete && (
                  <button
                    onClick={() => deleteSection(sec.id)}
                    className="p-2 rounded-xl bg-white/[0.05] hover:bg-rose-500/20 text-stone-400 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Excluir bloco customizado"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Section Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#141414] border border-white/15 rounded-2xl p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingSection ? `Editar Bloco: ${editingSection.title}` : 'Novo Bloco Customizado'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Título da Seção *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Descrição / Texto Informativo
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs resize-none"
                />
              </div>

              {(editingSection?.type === 'custom' || !editingSection) && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">
                      URL da Imagem de Destaque
                    </label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full py-2 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1">
                        Texto do Botão
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Saber Mais"
                        value={buttonText}
                        onChange={(e) => setButtonText(e.target.value)}
                        className="w-full py-2 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1">
                        Link do Botão
                      </label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={buttonUrl}
                        onChange={(e) => setButtonUrl(e.target.value)}
                        className="w-full py-2 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs"
                      />
                    </div>
                  </div>
                </>
              )}

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
                  Salvar Seção
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
