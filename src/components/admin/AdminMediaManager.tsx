import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MediaCategory, MediaItem } from '../../types';
import {
  Upload,
  Search,
  Filter,
  Trash2,
  Copy,
  Check,
  Sparkles,
  Image as ImageIcon,
  ExternalLink,
  ChevronDown,
  ArrowRight,
  HardDrive
} from 'lucide-react';

const CATEGORIES: MediaCategory[] = [
  'Logo',
  'Foto de Perfil',
  'Banner Principal',
  'Cortes',
  'Barba',
  'Equipe',
  'Barbearia',
  'Serviços',
  'Instagram',
  'Galeria',
  'Outras'
];

export const AdminMediaManager: React.FC = () => {
  const {
    mediaItems,
    addMediaItem,
    deleteMediaItem,
    updateMediaItem,
    assignMediaTo,
    barbershop
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [activeItem, setActiveItem] = useState<MediaItem | null>(null);
  const [copyToast, setCopyToast] = useState<string | null>(null);
  const [assignToast, setAssignToast] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Filter items
  const filtered = mediaItems.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.fileName.toLowerCase().includes(search.toLowerCase()) ||
      (item.altText && item.altText.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        addMediaItem({
          fileUrl: dataUrl,
          thumbnailUrl: dataUrl,
          fileName: file.name,
          category: (selectedCategory !== 'all' ? selectedCategory : 'Galeria') as MediaCategory,
          altText: file.name.replace(/\.[^/.]+$/, ''),
          fileSize: `${Math.round(file.size / 1024)} KB`
        });
      };
      reader.readAsDataURL(file);
    });
    setIsUploading(false);
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopyToast(id);
    setTimeout(() => setCopyToast(null), 2000);
  };

  const handleAssign = (imageUrl: string, target: 'profile' | 'hero' | 'story' | 'gallery') => {
    assignMediaTo(imageUrl, target);
    const targetNames = {
      profile: 'Foto de Perfil / Logo',
      hero: 'Banner Principal (Slide 1)',
      story: 'Foto da História',
      gallery: 'Galeria de Cortes'
    };
    setAssignToast(`Imagem aplicada em: ${targetNames[target]}!`);
    setTimeout(() => setAssignToast(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Biblioteca & Gerenciador de Imagens
          </h2>
          <p className="text-xs text-stone-400">
            Envie imagens do computador ou celular, organize por categoria e aplique em qualquer seção do cartão
          </p>
        </div>

        <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#A8FF3E] hover:bg-[#97f02d] text-black font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer">
          <Upload className="w-4 h-4 text-black stroke-[2.5]" />
          <span>{isUploading ? 'Processando fotos...' : 'Enviar Novas Imagens'}</span>
          <input
            type="file"
            multiple
            accept="image/png, image/jpeg, image/jpg, image/webp"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {assignToast && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs animate-fadeIn">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>{assignToast}</span>
        </div>
      )}

      {/* Storage & Quick Stat Card */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-[#141414] border border-white/[0.08]">
          <span className="text-[10px] text-stone-400 font-semibold uppercase">Total de Fotos</span>
          <p className="text-xl font-extrabold text-white mt-0.5 font-mono">{mediaItems.length}</p>
        </div>
        <div className="p-3.5 rounded-xl bg-[#141414] border border-white/[0.08]">
          <span className="text-[10px] text-stone-400 font-semibold uppercase">Formatos Suportados</span>
          <p className="text-xs font-bold text-stone-300 mt-1 font-mono">JPG, PNG, WEBP</p>
        </div>
        <div className="p-3.5 rounded-xl bg-[#141414] border border-white/[0.08]">
          <span className="text-[10px] text-stone-400 font-semibold uppercase">Otimização</span>
          <p className="text-xs font-bold text-emerald-400 mt-1">100% Automática</p>
        </div>
        <div className="p-3.5 rounded-xl bg-[#141414] border border-white/[0.08]">
          <span className="text-[10px] text-stone-400 font-semibold uppercase">Armazenamento</span>
          <p className="text-xs font-bold text-[#A8FF3E] mt-1">Permanente Local</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-[#141414] border border-white/10">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
          <input
            type="text"
            placeholder="Buscar imagens por nome ou etiqueta..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full py-2 pl-9 pr-3 rounded-xl bg-stone-900 border border-white/10 text-xs text-white placeholder:text-stone-600 focus:outline-none focus:border-[#A8FF3E]"
          />
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-white/15 text-white'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            Todas ({mediaItems.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = mediaItems.filter(i => i.category === cat).length;
            if (count === 0 && selectedCategory !== cat) return null;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#A8FF3E] text-black font-bold'
                    : 'text-stone-400 hover:text-white bg-stone-900/60'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Media */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="group relative rounded-2xl overflow-hidden bg-[#141414] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
          >
            {/* Image Preview Container */}
            <div
              onClick={() => setActiveItem(item)}
              className="relative aspect-square w-full overflow-hidden bg-stone-900 cursor-pointer"
            >
              <img
                src={item.fileUrl}
                alt={item.fileName}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-[11px] font-bold text-white px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-sm border border-white/20">
                  Visualizar
                </span>
              </div>
            </div>

            {/* Info & Metadata */}
            <div className="p-3 space-y-1 bg-stone-950/70 border-t border-white/[0.06]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#A8FF3E] uppercase tracking-wider truncate max-w-[100px]">
                  {item.category}
                </span>
                {item.fileSize && (
                  <span className="text-[9px] font-mono text-stone-500">{item.fileSize}</span>
                )}
              </div>
              <p className="text-xs font-semibold text-white truncate" title={item.fileName}>
                {item.fileName}
              </p>

              {/* Action Dropdown / Buttons */}
              <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between gap-1">
                {/* Assign to menu */}
                <div className="relative group/menu">
                  <button className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded bg-white/[0.08] hover:bg-white/15 text-stone-300 hover:text-white transition-colors">
                    <span>Usar em...</span>
                    <ChevronDown className="w-2.5 h-2.5" />
                  </button>

                  <div className="absolute bottom-full left-0 mb-1 w-44 rounded-xl bg-[#1a1a1a] border border-white/15 shadow-2xl p-1.5 hidden group-hover/menu:block z-30 space-y-0.5">
                    <button
                      onClick={() => handleAssign(item.fileUrl, 'profile')}
                      className="w-full text-left px-2 py-1.5 rounded-lg text-[11px] text-stone-300 hover:text-white hover:bg-white/10"
                    >
                      Foto de Perfil / Logo
                    </button>
                    <button
                      onClick={() => handleAssign(item.fileUrl, 'hero')}
                      className="w-full text-left px-2 py-1.5 rounded-lg text-[11px] text-stone-300 hover:text-white hover:bg-white/10"
                    >
                      Banner Principal
                    </button>
                    <button
                      onClick={() => handleAssign(item.fileUrl, 'story')}
                      className="w-full text-left px-2 py-1.5 rounded-lg text-[11px] text-stone-300 hover:text-white hover:bg-white/10"
                    >
                      Foto da História
                    </button>
                    <button
                      onClick={() => handleAssign(item.fileUrl, 'gallery')}
                      className="w-full text-left px-2 py-1.5 rounded-lg text-[11px] text-stone-300 hover:text-white hover:bg-white/10"
                    >
                      Galeria de Cortes
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleCopyUrl(item.fileUrl, item.id)}
                    className="p-1 rounded bg-white/[0.05] hover:bg-white/10 text-stone-400 hover:text-white transition-colors"
                    title="Copiar URL"
                  >
                    {copyToast === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => deleteMediaItem(item.id)}
                    className="p-1 rounded bg-white/[0.05] hover:bg-rose-500/20 text-stone-400 hover:text-rose-400 transition-colors"
                    title="Excluir da biblioteca"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Large Image Preview Modal */}
      {activeItem && (
        <div
          onClick={() => setActiveItem(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-xl w-full bg-[#141414] border border-white/20 rounded-2xl overflow-hidden p-4 space-y-3 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">{activeItem.fileName}</h4>
                <span className="text-[10px] text-[#A8FF3E] uppercase font-bold">{activeItem.category}</span>
              </div>
              <button
                onClick={() => setActiveItem(null)}
                className="p-1.5 rounded-full bg-white/10 text-white"
              >
                ✕
              </button>
            </div>

            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-black flex items-center justify-center">
              <img
                src={activeItem.fileUrl}
                alt={activeItem.fileName}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10">
              <span className="text-xs text-stone-400">Aplicar esta foto diretamente em:</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => {
                    handleAssign(activeItem.fileUrl, 'profile');
                    setActiveItem(null);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white"
                >
                  Perfil
                </button>
                <button
                  onClick={() => {
                    handleAssign(activeItem.fileUrl, 'hero');
                    setActiveItem(null);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#A8FF3E] text-black font-bold text-xs"
                >
                  Banner
                </button>
                <button
                  onClick={() => {
                    handleAssign(activeItem.fileUrl, 'story');
                    setActiveItem(null);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white"
                >
                  História
                </button>
                <button
                  onClick={() => {
                    handleAssign(activeItem.fileUrl, 'gallery');
                    setActiveItem(null);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white"
                >
                  Galeria
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
