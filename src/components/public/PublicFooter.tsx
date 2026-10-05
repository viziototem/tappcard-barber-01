import React from 'react';
import { useApp } from '../../context/AppContext';
import { Instagram, MessageCircle, Lock, ShieldCheck } from 'lucide-react';

export const PublicFooter: React.FC = () => {
  const { barbershop, setCurrentView, isAdminLoggedIn } = useApp();

  return (
    <footer className="px-4 pt-4 pb-24 text-center space-y-4">
      {/* Brand & Socials */}
      <div className="flex flex-col items-center justify-center space-y-2">
        <h4 className="text-sm font-bold text-white tracking-wider uppercase">
          {barbershop.name}
        </h4>
        <p className="text-[11px] text-stone-500 max-w-xs">
          {barbershop.address} · {barbershop.neighborhood} · {barbershop.city}
        </p>

        {/* Social Icons */}
        <div className="flex items-center gap-3 pt-1">
          <a
            href={`https://instagram.com/${barbershop.instagram.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/[0.05] hover:bg-white/10 text-stone-400 hover:text-white transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="w-4 h-4" />
          </a>
          <a
            href={`https://wa.me/${barbershop.whatsapp.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/[0.05] hover:bg-white/10 text-stone-400 hover:text-white transition-colors"
            aria-label="WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Powered by TappCard + Discreet Admin trigger */}
      <div className="pt-4 border-t border-white/[0.06] flex flex-col items-center gap-2">
        <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
          <span>Cartão digital desenvolvido pela</span>
          <span className="font-bold text-stone-400 tracking-wide">TappCard</span>
        </div>

        <button
          onClick={() => setCurrentView(isAdminLoggedIn ? 'admin' : 'admin-login')}
          className="flex items-center gap-1 text-[10px] text-stone-600 hover:text-stone-400 transition-colors py-1 px-2 rounded cursor-pointer"
        >
          <Lock className="w-3 h-3" />
          <span>{isAdminLoggedIn ? 'Painel Administrativo' : 'Área do Proprietário'}</span>
        </button>
      </div>
    </footer>
  );
};
