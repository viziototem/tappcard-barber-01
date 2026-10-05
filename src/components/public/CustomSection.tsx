import React from 'react';
import { PageSection } from '../../types';
import { ExternalLink, Sparkles } from 'lucide-react';

export const CustomSection: React.FC<{ section: PageSection }> = ({ section }) => {
  const { title, settings } = section;

  return (
    <section className="px-4 py-4">
      <div
        className="rounded-[22px] bg-[#121212] border border-white/[0.08] p-5 space-y-4 overflow-hidden relative"
        style={{
          borderRadius: 'var(--border-radius)',
          backgroundColor: settings?.backgroundColor || undefined
        }}
      >
        <div>
          <span
            className="text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5"
            style={{ color: 'var(--accent-color)' }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Destaque Especial</span>
          </span>
          <h3 className="text-xl font-extrabold text-white tracking-tight mt-0.5">
            {title}
          </h3>
          {settings?.description && (
            <p className="text-xs text-stone-300 mt-1 leading-relaxed">
              {settings.description}
            </p>
          )}
        </div>

        {settings?.imageUrl && (
          <div className="relative aspect-[16/9] rounded-[16px] overflow-hidden border border-white/10">
            <img
              src={settings.imageUrl}
              alt={title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        )}

        {settings?.buttonText && settings?.buttonUrl && (
          <a
            href={settings.buttonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full font-bold text-xs text-black transition-all active:scale-95 shadow-md cursor-pointer"
            style={{
              backgroundColor: 'var(--accent-color)',
              borderRadius: 'var(--button-radius)'
            }}
          >
            <span>{settings.buttonText}</span>
            <ExternalLink className="w-3.5 h-3.5 text-black" />
          </a>
        )}
      </div>
    </section>
  );
};
