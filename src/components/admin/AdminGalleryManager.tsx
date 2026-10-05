import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GalleryItem } from '../../types';
import {
  Sparkles,
  Plus,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Trash2,
  RefreshCw,
  Image as ImageIcon,
  Check,
  GripVertical,
  Layers
} from 'lucide-react';

export const AdminGalleryManager: React.FC = () => {
  const {
    gallery,
    updateGallery,
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    toggleGalleryItemVisibility,
    reorderGalleryItems,
    openMediaPicker
  } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // New item form
  const [newImageUrl, setNewImageUrl] = useState('/src/assets/images/barber_cut_service_1791211088254.jpg');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Cortes');

  // Drag and drop
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl.trim()) return;

    addGalleryItem({
      imageUrl: newImageUrl.trim(),
      title: newTitle.trim() || undefined,
      category: newCategory,
      visible: true
    });

    setIsAddModalOpen(false);
    setNewTitle('');
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const handleReplace = (id: string) => {
    openMediaPicker((url) => {
      updateGalleryItem(id, { imageUrl: url });
    });
  };

  const moveUp = (idx: number) => {
    if (idx > 0) reorderGalleryItems(idx, idx - 1);
  };

  const moveDown = (idx: number) => {
    if (idx < gallery.items.length - 1) reorderGalleryItems(idx, idx + 1);
  };

  const handleDragStart = (idx: number) => setDraggedIdx(idx);
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === idx) return;
    reorderGalleryItems(draggedIdx, idx);
    setDraggedIdx(idx);
  };
  const handleDragEnd = () => setDraggedIdx(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Gerenciador da Galeria de Cortes
          </h2>
          <p className="text-xs text-stone-400">
            Adicione transformações, organize a ordem de exibição e escolha o formato visual do portfólio
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Active switch */}
          <button
            onClick={() => updateGallery({ enabled: !gallery.enabled })}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              gallery.enabled
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                : 'bg-stone-800 border-white/5 text-stone-400'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${gallery.enabled ? 'bg-emerald-400' : 'bg-stone-500'}`} />
            <span>{gallery.enabled ? 'Galeria Ativa' : 'Galeria Oculta'}</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#A8FF3E] hover:bg-[#97f02d] text-black font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-black stroke-[2.5]" />
            <span>Adicionar Foto</span>
          </button>
        </div>
      </div>

      {saveToast && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>Galeria atualizada na página pública!</span>
        </div>
      )}

      {/* Gallery Settings Card */}
      <div className="p-5 rounded-2xl bg-[#141414] border border-white/[0.08] space-y-4">
        <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#A8FF3E]" />
          <span>Formato de Exibição & Textos</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">
              Título da Seção
            </label>
            <input
              type="text"
              value={gallery.title}
              onChange={(e) => updateGallery({ title: e.target.value })}
              className="w-full py-2 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">
              Subtítulo
            </label>
            <input
              type="text"
              value={gallery.subtitle}
              onChange={(e) => updateGallery({ subtitle: e.target.value })}
              className="w-full py-2 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">
              Layout Visual
            </label>
            <select
              value={gallery.layout}
              onChange={(e) => updateGallery({ layout: e.target.value as any })}
              className="w-full py-2 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs"
            >
              <option value="masonry">Mosaico Editorial (Masonry)</option>
              <option value="grid">Grade Uniforme</option>
              <option value="carousel">Carrossel / Rolagem Lateral</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sortable Items List */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white">
          Fotos da Galeria ({gallery.items.length})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {gallery.items.map((item, index) => (
            <div
              key={item.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                item.visible
                  ? 'bg-[#141414] border-white/10 hover:border-white/20'
                  : 'bg-[#101010] border-white/[0.04] opacity-50'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="cursor-grab active:cursor-grabbing text-stone-500 hover:text-white p-1"
                  title="Arraste para reordenar"
                >
                  <GripVertical className="w-4 h-4" />
                </div>

                <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-900 border border-white/10 shrink-0">
                  <img
                    src={item.imageUrl}
                    alt={item.title || 'Foto'}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">
                    {item.title || 'Sem título'}
                  </p>
                  <span className="text-[10px] text-[#A8FF3E] font-medium block">
                    {item.category || 'Cortes'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                  className="p-1 rounded text-stone-400 hover:text-white disabled:opacity-20"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => moveDown(index)}
                  disabled={index === gallery.items.length - 1}
                  className="p-1 rounded text-stone-400 hover:text-white disabled:opacity-20"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleReplace(item.id)}
                  className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/10 text-stone-300"
                  title="Trocar imagem da biblioteca"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => toggleGalleryItemVisibility(item.id)}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    item.visible
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-stone-800 text-stone-500 border-white/5'
                  }`}
                >
                  {item.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => deleteGalleryItem(item.id)}
                  className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-rose-500/20 text-stone-400 hover:text-rose-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#141414] border border-white/15 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white">Adicionar Foto à Galeria</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Imagem *
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="flex-1 py-2 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => openMediaPicker((url) => setNewImageUrl(url))}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold shrink-0"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-[#A8FF3E]" />
                    <span>Biblioteca</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Título do Corte / Estilo
                </label>
                <input
                  type="text"
                  placeholder="Ex: Skin Fade Degradê"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Categoria
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs"
                >
                  <option value="Cortes">Cortes</option>
                  <option value="Barba">Barba</option>
                  <option value="Equipe">Equipe</option>
                  <option value="Barbearia">Barbearia</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#A8FF3E] text-black font-bold text-xs"
                >
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
