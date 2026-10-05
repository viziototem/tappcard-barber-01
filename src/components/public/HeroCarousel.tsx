import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, ChevronRight, ChevronLeft, MapPin, Scissors, Clock } from 'lucide-react';

export const HeroCarousel: React.FC = () => {
  const {
    barbershop,
    heroSlides,
    heroSettings,
    openBookingModal,
    isBusinessOpen,
    statusBadgeText,
    nextOpeningInfo
  } = useApp();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Visible slides
  const slides = (heroSlides.length > 0 ? heroSlides : [
    {
      id: 'default-1',
      imageUrl: barbershop.heroImageUrl || '/src/assets/images/barbershop_hero_1791211076060.jpg',
      order: 0,
      visible: true,
      overlayEnabled: true,
      title: barbershop.slogan,
      subtitle: barbershop.description,
      buttonText: 'Agendar horário agora',
      buttonLink: 'booking'
    }
  ]).filter(s => s.visible).sort((a, b) => a.order - b.order);

  const totalSlides = slides.length;
  const currentSlide = slides[currentIndex] || slides[0];

  // Autoplay timer
  useEffect(() => {
    if (!heroSettings.autoplay || totalSlides <= 1 || (heroSettings.pauseOnInteraction && isHovered)) {
      return;
    }

    const intervalTime = heroSettings.interval || 5000;
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % totalSlides);
    }, intervalTime);

    return () => clearInterval(timer);
  }, [heroSettings, totalSlides, isHovered]);

  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % totalSlides);
  };

  const goToPrev = () => {
    setCurrentIndex(prev => (prev - 1 + totalSlides) % totalSlides);
  };

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (diff > 45) {
      goToNext();
    } else if (diff < -45) {
      goToPrev();
    }
    setTouchStartX(null);
  };

  const handleButtonClick = (actionLink?: string) => {
    if (actionLink === 'services') {
      const el = document.getElementById('services-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    openBookingModal();
  };

  return (
    <section className="relative w-full pt-4 pb-3 px-4">
      {/* Top Bar Header inside card */}
      <div className="flex items-center justify-between py-2 mb-3">
        <div className="flex items-center gap-2.5">
          {barbershop.logoUrl ? (
            <img
              src={barbershop.logoUrl}
              alt={barbershop.name}
              className="w-10 h-10 rounded-full object-cover border border-white/20"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-black text-sm shadow-md"
              style={{ backgroundColor: 'var(--accent-color)' }}
            >
              <Scissors className="w-5 h-5 text-black" />
            </div>
          )}
          <div>
            <h1 className="text-base font-bold tracking-tight text-white leading-tight">
              {barbershop.name}
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-stone-400">
              <MapPin className="w-3 h-3 text-stone-400" />
              <span>{barbershop.neighborhood}, {barbershop.city.split('-')[0].trim()}</span>
            </div>
          </div>
        </div>

        {/* Automatic Operating status badge */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium glass-pill cursor-help"
          title={nextOpeningInfo}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isBusinessOpen
                ? 'bg-emerald-400 animate-pulse'
                : 'bg-amber-400'
            }`}
          />
          <span className={isBusinessOpen ? 'text-emerald-300' : 'text-amber-300 font-semibold'}>
            {statusBadgeText}
          </span>
        </div>
      </div>

      {/* Hero Visual Card / Carousel Container */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative w-full aspect-[4/3] rounded-[22px] overflow-hidden border border-white/10 shadow-2xl flex flex-col justify-end p-5 group select-none"
        style={{ borderRadius: 'var(--border-radius)' }}
      >
        {/* Slides Images with Transition Effect */}
        {slides.map((slide, idx) => {
          const isActive = idx === currentIndex;
          let transitionClasses = 'opacity-0 scale-100 pointer-events-none';

          if (isActive) {
            transitionClasses = 'opacity-100 scale-100 pointer-events-auto';
          } else if (heroSettings.transition === 'zoom') {
            transitionClasses = 'opacity-0 scale-110 pointer-events-none';
          } else if (heroSettings.transition === 'slide') {
            transitionClasses = idx < currentIndex ? '-translate-x-full opacity-0' : 'translate-x-full opacity-0';
          }

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-all duration-700 ease-out ${transitionClasses}`}
            >
              <img
                src={slide.imageUrl}
                alt={slide.title || barbershop.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          );
        })}

        {/* Deep Vignette Gradient Scrim for Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/15 pointer-events-none z-10" />

        {/* Optional Arrow Controls */}
        {heroSettings.showArrows && totalSlides > 1 && (
          <div className="absolute inset-y-0 left-2 right-2 flex items-center justify-between z-20 pointer-events-none">
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrev();
              }}
              className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm pointer-events-auto transition-colors"
              aria-label="Slide anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm pointer-events-auto transition-colors"
              aria-label="Próximo slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Hero Content Overlay for Active Slide */}
        <div className="relative z-20 space-y-2">
          <div className="flex items-center justify-between">
            <div
              className="flex items-center gap-2 text-xs tracking-wide uppercase font-semibold"
              style={{ color: 'var(--accent-color)' }}
            >
              <span>Experiência Premium</span>
              <span aria-hidden="true">·</span>
              <span>Est. {barbershop.foundedYear}</span>
            </div>

            {/* Slide Index Pill if multiple */}
            {totalSlides > 1 && (
              <span className="text-[10px] font-mono font-bold text-white/70 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/10">
                {currentIndex + 1}/{totalSlides}
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            {currentSlide?.title || barbershop.slogan}
          </h2>

          <p className="text-xs sm:text-sm text-stone-300 line-clamp-2 leading-relaxed">
            {currentSlide?.subtitle || barbershop.description}
          </p>

          {/* Primary CTA Button */}
          <div className="pt-2">
            <button
              onClick={() => handleButtonClick(currentSlide?.buttonLink)}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 font-bold text-sm tracking-tight text-black transition-all shadow-lg active:scale-[0.98] cursor-pointer"
              style={{
                backgroundColor: 'var(--accent-color)',
                borderRadius: 'var(--button-radius)'
              }}
            >
              <Calendar className="w-4 h-4 text-black stroke-[2.5]" />
              <span>{currentSlide?.buttonText || 'Agendar horário agora'}</span>
              <ChevronRight className="w-4 h-4 text-black stroke-[2.5]" />
            </button>
          </div>

          {/* Dots Indicator */}
          {heroSettings.showDots && totalSlides > 1 && (
            <div className="flex items-center justify-center gap-1.5 pt-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    i === currentIndex
                      ? 'w-6 bg-[#A8FF3E]'
                      : 'w-2 bg-white/30 hover:bg-white/60'
                  }`}
                  aria-label={`Ir para slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
