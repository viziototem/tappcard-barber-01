import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminOverview } from './AdminOverview';
import { AdminBookings } from './AdminBookings';
import { AdminAppearance } from './AdminAppearance';
import { AdminContent } from './AdminContent';
import { AdminServices } from './AdminServices';
import { AdminBookingSettings } from './AdminBookingSettings';
import { AdminButtonsManager } from './AdminButtonsManager';
import { AdminPageBuilder } from './AdminPageBuilder';
import { AdminInstagram } from './AdminInstagram';
import { AdminMediaManager } from './AdminMediaManager';
import { AdminHeroCarousel } from './AdminHeroCarousel';
import { AdminGalleryManager } from './AdminGalleryManager';
import { AdminBusinessHours } from './AdminBusinessHours';
import { AdminClosedPopup } from './AdminClosedPopup';
import { PublicCard } from '../public/PublicCard';
import {
  LayoutDashboard,
  Calendar,
  Palette,
  Scissors,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
  SplitSquareHorizontal,
  Menu,
  X,
  Link2,
  Layers,
  Instagram,
  BookOpen,
  MapPin,
  Phone,
  Check,
  Sparkles,
  Smartphone,
  Image as ImageIcon,
  Sliders,
  Clock,
  AlertCircle
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { barbershop, logoutAdmin, setCurrentView, bookings } = useApp();
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'media'
    | 'hero'
    | 'gallery'
    | 'hours'
    | 'closed_popup'
    | 'page_builder'
    | 'buttons'
    | 'instagram'
    | 'services'
    | 'bookings'
    | 'story'
    | 'location'
    | 'contact'
    | 'appearance'
    | 'settings'
  >('overview');

  const [splitPreview, setSplitPreview] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [publishToast, setPublishToast] = useState(false);

  const pendingCount = bookings.filter(b => b.status === 'pending').length;

  interface NavTabItem {
    id: typeof activeTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    highlight?: boolean;
  }

  const navigationTabs: NavTabItem[] = [
    { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'media', label: 'Biblioteca de Imagens', icon: ImageIcon, highlight: true },
    { id: 'hero', label: 'Banner Principal (Carrossel)', icon: Sliders, highlight: true },
    { id: 'gallery', label: 'Galeria de Cortes', icon: Sparkles },
    { id: 'hours', label: 'Horário de Funcionamento', icon: Clock },
    { id: 'closed_popup', label: 'Aviso de Barbearia Fechada', icon: AlertCircle },
    { id: 'page_builder', label: 'Página Inicial (Seções)', icon: Layers },
    { id: 'buttons', label: 'Botões & Links', icon: Link2 },
    { id: 'instagram', label: 'Instagram', icon: Instagram },
    { id: 'services', label: 'Serviços & Preços', icon: Scissors },
    { id: 'bookings', label: 'Agendamentos', icon: Calendar, badge: pendingCount > 0 ? pendingCount : undefined },
    { id: 'story', label: 'História', icon: BookOpen },
    { id: 'location', label: 'Localização & Mapa', icon: MapPin },
    { id: 'contact', label: 'Contato', icon: Phone },
    { id: 'appearance', label: 'Aparência & Cores', icon: Palette },
    { id: 'settings', label: 'Configurações', icon: Settings }
  ];

  const handlePublish = () => {
    setPublishToast(true);
    setTimeout(() => setPublishToast(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col font-sans selection:bg-[#A8FF3E] selection:text-black">
      {/* Top Admin Header */}
      <header className="h-16 px-4 sm:px-6 bg-[#121212] border-b border-white/10 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          {/* Mobile menu trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-white/[0.05] text-stone-300 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#A8FF3E] flex items-center justify-center text-black font-bold shadow">
              <ShieldCheck className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-white leading-tight">
                {barbershop.name}
              </h1>
              <p className="text-[10px] text-stone-400 font-medium">
                Painel Master Proprietário
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Publish Changes button with visual confirmation */}
          <button
            onClick={handlePublish}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#A8FF3E] hover:bg-[#97f02d] text-black text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
          >
            {publishToast ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Publicado!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Publicar Alterações</span>
                <span className="sm:hidden">Publicar</span>
              </>
            )}
          </button>

          {/* Toggle Split Preview on large screens */}
          <button
            onClick={() => setSplitPreview(!splitPreview)}
            className={`hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              splitPreview
                ? 'bg-[#A8FF3E]/15 border-[#A8FF3E] text-[#A8FF3E]'
                : 'bg-white/[0.05] border-white/10 text-stone-300 hover:text-white'
            }`}
          >
            <SplitSquareHorizontal className="w-3.5 h-3.5" />
            <span>{splitPreview ? 'Ocultar Preview' : 'Preview Lateral'}</span>
          </button>

          {/* View Public Card */}
          <button
            onClick={() => setCurrentView('public')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/10 text-stone-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Ver Cartão</span>
          </button>

          {/* Logout */}
          <button
            onClick={logoutAdmin}
            className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold transition-colors cursor-pointer"
            title="Sair do painel"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <aside
          className={`fixed inset-y-16 left-0 z-30 w-64 bg-[#101010] border-r border-white/10 p-4 flex flex-col justify-between transition-transform duration-300 overflow-y-auto lg:static lg:translate-x-0 ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider px-3 mb-2 block">
              Menu de Gestão Total
            </span>

            {navigationTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#A8FF3E] text-black shadow-md'
                      : 'text-stone-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-black' : tab.highlight ? 'text-[#A8FF3E]' : 'text-stone-400'}`} />
                    <span className="truncate">{tab.label}</span>
                  </div>

                  {tab.badge !== undefined && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        isActive
                          ? 'bg-black text-[#A8FF3E]'
                          : 'bg-[#A8FF3E]/20 text-[#A8FF3E]'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer info in sidebar */}
          <div className="pt-4 mt-4 border-t border-white/[0.08] text-center">
            <p className="text-[10px] text-stone-500">
              Desenvolvido por <span className="font-bold text-stone-400">TappCard</span>
            </p>
            <p className="text-[9px] text-stone-600 mt-0.5">Versão Master 2026</p>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            {activeTab === 'overview' && (
              <AdminOverview onNavigateTab={(t: any) => setActiveTab(t)} />
            )}
            {activeTab === 'media' && <AdminMediaManager />}
            {activeTab === 'hero' && <AdminHeroCarousel />}
            {activeTab === 'gallery' && <AdminGalleryManager />}
            {activeTab === 'hours' && <AdminBusinessHours />}
            {activeTab === 'closed_popup' && <AdminClosedPopup />}
            {activeTab === 'page_builder' && <AdminPageBuilder />}
            {activeTab === 'buttons' && <AdminButtonsManager />}
            {activeTab === 'instagram' && <AdminInstagram />}
            {activeTab === 'services' && <AdminServices />}
            {activeTab === 'bookings' && <AdminBookings />}
            {activeTab === 'story' && <AdminContent mode="story" />}
            {activeTab === 'location' && <AdminContent mode="location" />}
            {activeTab === 'contact' && <AdminContent mode="contact" />}
            {activeTab === 'appearance' && <AdminAppearance />}
            {activeTab === 'settings' && <AdminBookingSettings />}
          </div>
        </main>

        {/* Split Live Preview for Desktop */}
        {splitPreview && (
          <aside className="hidden xl:block w-[460px] border-l border-white/10 bg-black/40 overflow-y-auto p-4">
            <div className="sticky top-2 mb-3 flex items-center justify-between px-2">
              <span className="text-xs font-bold text-[#A8FF3E] uppercase tracking-wider flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5" />
                <span>Prévia em Tempo Real</span>
              </span>
              <button
                onClick={() => setSplitPreview(false)}
                className="text-stone-500 hover:text-white text-xs cursor-pointer"
              >
                Fechar
              </button>
            </div>
            <div className="rounded-[32px] overflow-hidden border border-white/15 shadow-2xl">
              <PublicCard />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
