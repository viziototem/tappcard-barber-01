import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Instagram,
  MapPin,
  MessageCircle,
  PhoneCall,
  Star,
  ExternalLink,
  Wifi,
  QrCode,
  Link2,
  Globe,
  Mail,
  Video,
  Share2,
  Bookmark,
  Sparkles
} from 'lucide-react';
import { ButtonItem } from '../../types';

export const QuickLinksGrid: React.FC = () => {
  const {
    buttons,
    barbershop,
    openBookingModal,
    openSpecialModal,
    trackMetric
  } = useApp();

  // Active sorted buttons
  const activeButtons = [...buttons]
    .filter(b => b.active)
    .sort((a, b) => a.order - b.order);

  if (activeButtons.length === 0) return null;

  const getIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'whatsapp':
        return MessageCircle;
      case 'instagram':
        return Instagram;
      case 'calendar':
      case 'agendamento':
        return Calendar;
      case 'location':
      case 'localizacao':
      case 'mapa':
        return MapPin;
      case 'star':
      case 'review':
      case 'avaliacao':
        return Star;
      case 'phone':
      case 'telefone':
      case 'call':
        return PhoneCall;
      case 'wifi':
        return Wifi;
      case 'pix':
        return QrCode;
      case 'facebook':
      case 'social':
        return Share2;
      case 'youtube':
      case 'tiktok':
      case 'video':
        return Video;
      case 'email':
      case 'mail':
        return Mail;
      case 'website':
      case 'site':
      case 'link':
      default:
        return Link2;
    }
  };

  const handleButtonClick = (btn: ButtonItem) => {
    switch (btn.type) {
      case 'whatsapp': {
        trackMetric('whatsappClicks');
        const phone = (btn.url || barbershop.whatsapp).replace(/\D/g, '');
        const text = encodeURIComponent(`Olá! Conheci a ${barbershop.name} pelo cartão digital e gostaria de um atendimento.`);
        window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
        break;
      }
      case 'instagram': {
        trackMetric('instagramClicks');
        const username = barbershop.instagram.replace('@', '').trim();
        const url = btn.url || `https://instagram.com/${username}`;
        window.open(url, '_blank');
        break;
      }
      case 'booking': {
        openBookingModal();
        break;
      }
      case 'location': {
        trackMetric('mapsClicks');
        if (btn.url) {
          window.open(btn.url, '_blank');
        } else if (barbershop.googleMapsUrl) {
          window.open(barbershop.googleMapsUrl, '_blank');
        } else {
          const query = encodeURIComponent(`${barbershop.name} ${barbershop.address} ${barbershop.city}`);
          window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
        }
        break;
      }
      case 'reviews': {
        const url = btn.url || barbershop.googleReviewUrl || 'https://search.google.com/local/writereview';
        window.open(url, '_blank');
        break;
      }
      case 'call': {
        const rawPhone = (btn.url || barbershop.phone).replace(/\D/g, '');
        window.location.href = `tel:${rawPhone}`;
        break;
      }
      case 'wifi': {
        openSpecialModal('wifi', btn.wifiConfig);
        break;
      }
      case 'pix': {
        openSpecialModal('pix', btn.pixConfig);
        break;
      }
      case 'custom_url':
      default: {
        if (btn.url) {
          const formatted = btn.url.startsWith('http') ? btn.url : `https://${btn.url}`;
          window.open(formatted, '_blank');
        }
        break;
      }
    }
  };

  const getStyleClasses = (btn: ButtonItem) => {
    switch (btn.style) {
      case 'primary':
        return 'bg-[#A8FF3E]/10 border-[#A8FF3E]/40 hover:border-[#A8FF3E] text-white';
      case 'secondary':
        return 'bg-[#181818] border-white/10 hover:border-white/20 text-white';
      case 'outline':
        return 'bg-transparent border-white/20 hover:border-white/40 text-white';
      case 'minimal':
        return 'bg-[#0f0f0f] border-transparent hover:border-white/10 text-white';
      case 'glass':
      default:
        return 'bg-[#141414] hover:bg-[#1a1a1a] border-white/[0.08] hover:border-white/15 text-white';
    }
  };

  return (
    <section className="px-4 py-2">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-sm font-bold tracking-tight text-white uppercase text-stone-300">
          Tudo em um só lugar
        </h3>
        <span className="text-[11px] text-stone-500">
          {activeButtons.length} atalhos rápidos
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {activeButtons.map((btn) => {
          const Icon = getIcon(btn.icon);
          const styleClasses = getStyleClasses(btn);

          return (
            <button
              key={btn.id}
              onClick={() => handleButtonClick(btn)}
              className={`relative flex flex-col justify-between p-3.5 text-left rounded-[18px] border transition-all duration-200 active:scale-[0.98] group cursor-pointer ${styleClasses}`}
              style={{
                borderRadius: 'calc(var(--border-radius) - 4px)'
              }}
            >
              {/* Header inside button card */}
              <div className="flex items-center justify-between w-full mb-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/[0.06] border border-white/[0.08] group-hover:bg-white/[0.1] transition-colors"
                >
                  <Icon className="w-4 h-4 text-white" />
                </div>

                {btn.badge ? (
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full text-black truncate max-w-[80px]"
                    style={{ backgroundColor: 'var(--accent-color)' }}
                  >
                    {btn.badge}
                  </span>
                ) : (
                  <ExternalLink className="w-3.5 h-3.5 text-stone-600 group-hover:text-stone-300 transition-colors" />
                )}
              </div>

              <div>
                <p className="text-xs sm:text-sm font-semibold text-white tracking-tight leading-none mb-1 group-hover:text-white truncate">
                  {btn.label}
                </p>
                {btn.subtitle && (
                  <p className="text-[11px] text-stone-400 truncate">
                    {btn.subtitle}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
