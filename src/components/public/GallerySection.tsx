import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { GalleryItem } from '../../types';

export const GallerySection: React.FC = () => {
  const { gallery } = useApp();
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  if (!gallery.enabled) return null;

  const items = (gallery.items || []).filter(it => it.visible).sort((a, b) => a.order - b.order);
  if (items.length === 0) return null;

  return (
    <section className="px-4 py-4">
      <div
        className="rounded-[22px] bg-[#121212] border border-white/[0.08] p-5 space-y-4 overflow-hidden relative"
        style={{ borderRadius: 'var(--border-radius)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <span
              className="text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5"
              style={{ color: 'var(--accent-color)' }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Portfólio em Destaque</span>
            </span>
            <h3 className="text-xl font-extrabold text-white tracking-tight mt-0.5">
              {gallery.title || 'Galeria de Cortes'}
            </h3>
            {gallery.subtitle && (
              <p className="text-xs text-stone-400 mt-0.5">
                {gallery.subtitle}
              </p>
            )}
          </div>
          <span className="text-xs font-mono text-stone-500 font-semibold">
            {items.length} fotos
          </span>
        </div>

        {/* Layout Renderer */}
        {gallery.layout === 'masonry' || gallery.layout === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {items.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => setActiveItem(item)}
                className={`relative rounded-[16px] overflow-hidden bg-stone-900 border border-white/10 group cursor-pointer aspect-square ${
                  gallery.layout === 'masonry' && idx % 3 === 0 ? 'row-span-2 aspect-[3/4]' : ''
                }`}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title || 'Corte Barbearia'}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                  <div className="w-full flex items-center justify-between text-white text-xs">
                    <span className="font-semibold truncate">{item.title || 'Ver detalhes'}</span>
                    <Maximize2 className="w-3.5 h-3.5 text-stone-300 shrink-0" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Horizontal Carousel / Scroll */
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveItem(item)}
                className="w-48 shrink-0 snap-start rounded-[16px] overflow-hidden bg-stone-900 border border-white/10 relative group cursor-pointer aspect-[3/4]"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title || 'Corte'}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                  <span className="text-xs font-bold text-white truncate">{item.title || 'Corte'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {activeItem && (
        <div
          onClick={() => setActiveItem(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-lg w-full bg-[#141414] rounded-2xl overflow-hidden border border-white/20 shadow-2xl space-y-3 p-3"
          >
            <div className="flex items-center justify-between px-2 pt-1">
              <span className="text-xs font-bold text-white">
                {activeItem.title || 'Foto da Barbearia'}
              </span>
              <button
                onClick={() => setActiveItem(null)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black">
              <img
                src={activeItem.imageUrl}
                alt={activeItem.title || 'Foto'}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
