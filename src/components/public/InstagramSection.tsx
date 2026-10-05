import React, { useRef, useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Instagram, ExternalLink, Heart, ChevronLeft, ChevronRight } from 'lucide-react';

export const InstagramSection: React.FC = () => {
  const { instagram, barbershop, trackMetric } = useApp();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  if (!instagram.enabled) return null;

  const handleOpenProfile = () => {
    trackMetric('instagramClicks');
    const url = instagram.profileUrl || `https://instagram.com/${instagram.username.replace('@', '')}`;
    window.open(url, '_blank');
  };

  const handlePostClick = (url: string) => {
    trackMetric('instagramClicks');
    window.open(url || instagram.profileUrl || `https://instagram.com/${instagram.username.replace('@', '')}`, '_blank');
  };

  const updateScrollButtons = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const offset = direction === 'left' ? -220 : 220;
      carouselRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const posts = (instagram.posts || []).slice(0, instagram.postsLimit || 6);

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
              <Instagram className="w-3.5 h-3.5" />
              <span>Instagram Oficial</span>
            </span>
            <h3 className="text-xl font-extrabold text-white tracking-tight mt-0.5">
              {instagram.title || 'Siga nosso estilo'}
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              {instagram.subtitle || 'Confira os últimos trabalhos e tendências.'}
            </p>
          </div>

          <button
            onClick={handleOpenProfile}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition-colors cursor-pointer shrink-0"
          >
            <span>@{instagram.username.replace('@', '')}</span>
            <ExternalLink className="w-3 h-3 text-stone-400" />
          </button>
        </div>

        {/* Layout Render */}
        {instagram.layout === 'horizontal_carousel' && (
          <div className="relative">
            <div
              ref={carouselRef}
              onScroll={updateScrollButtons}
              className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory scroll-smooth"
            >
              {posts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => handlePostClick(post.url)}
                  className="w-44 shrink-0 snap-start rounded-[16px] overflow-hidden bg-stone-900 border border-white/10 relative group cursor-pointer aspect-square transition-transform duration-300 active:scale-95"
                >
                  <img
                    src={post.imageUrl}
                    alt={post.caption || 'Instagram Post'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

                  {/* Likes and caption */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-[11px]">
                    <div className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
                      <span className="font-mono text-[10px] font-bold">{post.likes || 120}</span>
                    </div>
                    <Instagram className="w-3.5 h-3.5 text-white/80" />
                  </div>
                </div>
              ))}
            </div>

            {/* Scroll navigation dots / buttons */}
            <div className="flex items-center justify-end gap-1.5 pt-1">
              <button
                onClick={() => scroll('left')}
                className="w-7 h-7 rounded-full bg-white/[0.06] hover:bg-white/10 flex items-center justify-center text-stone-300 transition-colors"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="w-7 h-7 rounded-full bg-white/[0.06] hover:bg-white/10 flex items-center justify-center text-stone-300 transition-colors"
                aria-label="Próximo"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {instagram.layout === 'grid_2_columns' && (
          <div className="grid grid-cols-2 gap-2.5">
            {posts.map((post) => (
              <div
                key={post.id}
                onClick={() => handlePostClick(post.url)}
                className="aspect-square rounded-[16px] overflow-hidden bg-stone-900 border border-white/10 relative group cursor-pointer"
              >
                <img
                  src={post.imageUrl}
                  alt={post.caption || 'Instagram'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                  <span className="text-[10px] text-white truncate">{post.caption || 'Ver no Instagram'}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {instagram.layout === 'grid_3_columns' && (
          <div className="grid grid-cols-3 gap-2">
            {posts.map((post) => (
              <div
                key={post.id}
                onClick={() => handlePostClick(post.url)}
                className="aspect-square rounded-[12px] overflow-hidden bg-stone-900 border border-white/10 relative group cursor-pointer"
              >
                <img
                  src={post.imageUrl}
                  alt={post.caption || 'Instagram'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
        )}

        {instagram.layout === 'large_featured_post' && (
          <div className="space-y-2.5">
            {posts[0] && (
              <div
                onClick={() => handlePostClick(posts[0].url)}
                className="aspect-[16/10] rounded-[18px] overflow-hidden bg-stone-900 border border-white/10 relative group cursor-pointer"
              >
                <img
                  src={posts[0].imageUrl}
                  alt="Destaque"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3.5">
                  <p className="text-xs text-white font-medium line-clamp-1">
                    {posts[0].caption || 'Corte exclusivo da semana'}
                  </p>
                </div>
              </div>
            )}
            <div className="grid grid-cols-3 gap-2">
              {posts.slice(1, 4).map((post) => (
                <div
                  key={post.id}
                  onClick={() => handlePostClick(post.url)}
                  className="aspect-square rounded-[12px] overflow-hidden bg-stone-900 border border-white/10 relative cursor-pointer"
                >
                  <img
                    src={post.imageUrl}
                    alt="Corte"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {instagram.layout === 'mixed_editorial' && (
          <div className="grid grid-cols-3 gap-2">
            {posts[0] && (
              <div
                onClick={() => handlePostClick(posts[0].url)}
                className="col-span-2 row-span-2 aspect-square rounded-[16px] overflow-hidden bg-stone-900 border border-white/10 relative cursor-pointer group"
              >
                <img
                  src={posts[0].imageUrl}
                  alt="Post Principal"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                  <span className="text-xs font-bold text-white">Destaque Imperial</span>
                </div>
              </div>
            )}
            {posts.slice(1, 3).map((post) => (
              <div
                key={post.id}
                onClick={() => handlePostClick(post.url)}
                className="aspect-square rounded-[14px] overflow-hidden bg-stone-900 border border-white/10 relative cursor-pointer group"
              >
                <img
                  src={post.imageUrl}
                  alt="Post"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA to Instagram */}
        <button
          onClick={handleOpenProfile}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full font-bold text-xs text-white bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-amber-600/30 hover:from-purple-600/40 hover:via-pink-600/40 hover:to-amber-600/40 border border-pink-500/30 active:scale-[0.98] transition-all cursor-pointer shadow-md"
          style={{
            borderRadius: 'var(--button-radius)'
          }}
        >
          <Instagram className="w-4 h-4 text-pink-400" />
          <span>{instagram.buttonLabel || 'Ver perfil no Instagram'}</span>
          <ExternalLink className="w-3.5 h-3.5 text-stone-300" />
        </button>
      </div>
    </section>
  );
};
