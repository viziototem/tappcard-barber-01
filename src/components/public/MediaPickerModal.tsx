import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MediaCategory } from '../../types';
import { Image as ImageIcon, Upload, X, Check, Search, Filter } from 'lucide-react';

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

export const MediaPickerModal: React.FC = () => {
  const {
    isMediaPickerOpen,
    closeMediaPicker,
    onSelectMediaFromPicker,
    mediaItems,
    addMediaItem
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedUrl, setSelectedUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  if (!isMediaPickerOpen) return null;

  const filtered = mediaItems.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.fileName.toLowerCase().includes(search.toLowerCase()) ||
      (item.altText && item.altText.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const newItem = addMediaItem({
        fileUrl: dataUrl,
        fileName: file.name,
        category: (selectedCategory !== 'all' ? selectedCategory : 'Outras') as MediaCategory,
        altText: file.name.replace(/\.[^/.]+$/, ''),
        fileSize: `${Math.round(file.size / 1024)} KB`
      });
      setSelectedUrl(newItem.fileUrl);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleConfirm = () => {
    if (selectedUrl) {
      onSelectMediaFromPicker(selectedUrl);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#141414] border border-white/15 rounded-2xl flex flex-col max-h-[85vh] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#A8FF3E]/10 flex items-center justify-center text-[#A8FF3E]">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Selecionar Imagem da Biblioteca</h3>
              <p className="text-[11px] text-stone-400">Escolha uma imagem existente ou faça upload do seu dispositivo</p>
            </div>
          </div>

          <button
            onClick={closeMediaPicker}
            className="w-7 h-7 rounded-full flex items-center justify-center bg-white/[0.06] hover:bg-white/10 text-stone-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toolbar: Upload, Search & Filter */}
        <div className="p-3 border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-2.5 bg-stone-900/40">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
              <input
                type="text"
                placeholder="Buscar por nome..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full py-1.5 pl-8 pr-3 rounded-lg bg-stone-900 border border-white/10 text-xs text-white placeholder:text-stone-600 focus:outline-none focus:border-[#A8FF3E]"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="py-1.5 px-2.5 rounded-lg bg-stone-900 border border-white/10 text-xs text-stone-300 focus:outline-none"
            >
              <option value="all">Todas Categorias</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Upload Button */}
          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold cursor-pointer shrink-0 transition-colors">
            <Upload className="w-3.5 h-3.5 text-[#A8FF3E]" />
            <span>{isUploading ? 'Enviando...' : 'Enviar do Dispositivo'}</span>
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Grid of Images */}
        <div className="p-4 overflow-y-auto flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {filtered.map((item) => {
            const isSelected = selectedUrl === item.fileUrl;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedUrl(item.fileUrl)}
                className={`group relative aspect-square rounded-xl overflow-hidden border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-[#A8FF3E] ring-2 ring-[#A8FF3E]/30 scale-[0.98]'
                    : 'border-white/10 bg-stone-900/60 hover:border-white/25'
                }`}
              >
                <img
                  src={item.fileUrl}
                  alt={item.fileName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#A8FF3E] flex items-center justify-center text-black">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-2">
                  <p className="text-[10px] font-semibold text-white truncate">{item.fileName}</p>
                  <span className="text-[9px] text-stone-400">{item.category}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-white/10 flex items-center justify-between bg-stone-950/60">
          <span className="text-xs text-stone-400">
            {selectedUrl ? '1 imagem selecionada' : 'Nenhuma imagem selecionada'}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={closeMediaPicker}
              className="px-3 py-1.5 rounded-lg bg-stone-800 text-stone-300 text-xs font-semibold hover:text-white"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedUrl}
              className="px-4 py-1.5 rounded-lg bg-[#A8FF3E] text-black font-bold text-xs disabled:opacity-40 cursor-pointer shadow-md"
            >
              Usar Imagem Selecionada
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
