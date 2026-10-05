import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  MessageCircle,
  Eye,
  Instagram,
  MapPin,
  TrendingUp,
  Scissors,
  CheckCircle2,
  Clock,
  ExternalLink,
  Sparkles,
  Image as ImageIcon,
  Sliders,
  Upload,
  HardDrive
} from 'lucide-react';

export const AdminOverview: React.FC<{ onNavigateTab: (tab: string) => void }> = ({ onNavigateTab }) => {
  const {
    metrics,
    bookings,
    services,
    barbershop,
    mediaItems,
    heroSlides,
    isBusinessOpen,
    statusBadgeText,
    nextOpeningInfo,
    setCurrentView,
    updateBookingStatus
  } = useApp();

  const pendingBookings = bookings.filter(b => b.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome with Live Operating Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-stone-900 via-[#151515] to-[#121212] border border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#A8FF3E] uppercase tracking-wider">
              Painel de Gestão Master
            </span>
            <span className="text-stone-600">·</span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isBusinessOpen ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
              }`}
            >
              {statusBadgeText} ({nextOpeningInfo})
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
            {barbershop.name}
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Seu cartão virtual está ativo com carrossel dinâmico e agendamentos em tempo real.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('public')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-all cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Ver Cartão Público</span>
          </button>

          <button
            onClick={() => onNavigateTab('hero')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#A8FF3E] hover:bg-[#97f02d] text-black text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Editar Banner</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-[#141414] border border-white/[0.08] space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-medium">Visualizações</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white font-mono">
            {metrics.views.toLocaleString('pt-BR')}
          </p>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Acessos únicos registrados
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#141414] border border-white/[0.08] space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-medium">Agendamentos</span>
            <div className="w-8 h-8 rounded-lg bg-[#A8FF3E]/10 flex items-center justify-center text-[#A8FF3E]">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white font-mono">
            {metrics.bookingsInitiated.toLocaleString('pt-BR')}
          </p>
          <span className="text-[10px] text-stone-400">
            {pendingBookings.length} aguardando atendimento
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#141414] border border-white/[0.08] space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-medium">Cliques WhatsApp</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <MessageCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white font-mono">
            {metrics.whatsappClicks.toLocaleString('pt-BR')}
          </p>
          <span className="text-[10px] text-stone-400">
            Conversões diretas no chat
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#141414] border border-white/[0.08] space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-medium">Engajamento Social</span>
            <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-400">
              <Instagram className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white font-mono">
            {metrics.instagramClicks + metrics.mapsClicks}
          </p>
          <span className="text-[10px] text-stone-400">
            Instagram + Rotas GPS
          </span>
        </div>
      </div>

      {/* Media Dashboard Card (Requested in prompt) */}
      <div className="p-5 rounded-2xl bg-[#141414] border border-white/[0.08] space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#A8FF3E]/15 flex items-center justify-center text-[#A8FF3E]">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Mídia & Banner Principal
              </h3>
              <p className="text-xs text-stone-400">
                {mediaItems.length} imagens salvas na biblioteca · {heroSlides.length} fotos ativas no carrossel de entrada
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('media')}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Biblioteca de Imagens
            </button>
            <button
              onClick={() => onNavigateTab('hero')}
              className="px-3.5 py-1.5 rounded-xl bg-[#A8FF3E] hover:bg-[#97f02d] text-black text-xs font-bold transition-colors cursor-pointer"
            >
              Configurar Banner ({heroSlides.length}/10)
            </button>
          </div>
        </div>

        {/* Recent Added Images Carousel Preview */}
        <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
          {mediaItems.slice(0, 6).map((img) => (
            <div
              key={img.id}
              onClick={() => onNavigateTab('media')}
              className="w-24 shrink-0 rounded-xl overflow-hidden bg-stone-900 border border-white/10 aspect-square relative group cursor-pointer"
            >
              <img
                src={img.fileUrl}
                alt={img.fileName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-[9px] text-white font-bold">Ver</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Recent Bookings & Quick Catalog Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings (2 Cols) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#141414] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Últimos Agendamentos Recebidos
              </h3>
              <p className="text-xs text-stone-400">
                Clientes que iniciaram solicitação de horário pelo cartão
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('bookings')}
              className="text-xs font-semibold text-[#A8FF3E] hover:underline cursor-pointer"
            >
              Ver todos ({bookings.length})
            </button>
          </div>

          <div className="space-y-2.5">
            {bookings.slice(0, 5).map((booking) => (
              <div
                key={booking.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-stone-900/60 border border-white/[0.06] hover:border-white/10 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">
                      {booking.customerName}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        booking.status === 'confirmed'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : booking.status === 'pending'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-stone-800 text-stone-400'
                      }`}
                    >
                      {booking.status === 'confirmed' ? 'Confirmado' : booking.status === 'pending' ? 'Pendente' : 'Concluído'}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-stone-400">
                    <span className="text-white font-medium">{booking.service}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-stone-500" />
                      {booking.date.split('-').reverse().join('/')} às {booking.time}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{booking.people} {booking.people === 1 ? 'pessoa' : 'pessoas'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  {booking.status === 'pending' && (
                    <button
                      onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-medium border border-emerald-500/30 transition-colors cursor-pointer"
                    >
                      Confirmar
                    </button>
                  )}
                  {booking.customerPhone && (
                    <a
                      href={`https://wa.me/${booking.customerPhone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/10 text-emerald-400 transition-colors"
                      title="Abrir WhatsApp do cliente"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Info Summary */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-[#141414] border border-white/[0.08] space-y-3">
            <h3 className="text-sm font-bold text-white tracking-tight">
              Status & Horário
            </h3>
            <div className="p-3 rounded-xl bg-stone-900/60 border border-white/5 space-y-1">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isBusinessOpen ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                <span className="text-xs font-bold text-white">{statusBadgeText}</span>
              </div>
              <p className="text-[11px] text-stone-400">{nextOpeningInfo}</p>
            </div>
            <button
              onClick={() => onNavigateTab('hours')}
              className="w-full py-2 px-3 rounded-xl bg-white/[0.06] hover:bg-white/10 text-xs font-semibold text-white transition-colors cursor-pointer text-center"
            >
              Configurar Horários Semanais
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-[#141414] border border-white/[0.08] space-y-3">
            <h3 className="text-sm font-bold text-white tracking-tight">
              Aviso de Fechamento (Popup)
            </h3>
            <p className="text-xs text-stone-400">
              Avisa o cliente educadamente sem bloquear o acesso aos serviços ou agendamento.
            </p>
            <button
              onClick={() => onNavigateTab('closed_popup')}
              className="w-full py-2 px-3 rounded-xl bg-white/[0.06] hover:bg-white/10 text-xs font-semibold text-white transition-colors cursor-pointer text-center"
            >
              Editar Aviso & Popup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
