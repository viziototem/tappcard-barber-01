import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { InstagramLayout } from '../../types';
import {
  Instagram,
  Sparkles,
  Check,
  Plus,
  Trash2,
  ExternalLink,
  Layers,
  Sliders,
  Image as ImageIcon
} from 'lucide-react';

export const AdminInstagram: React.FC = () => {
  const { instagram, updateInstagram, addInstagramPost, deleteInstagramPost } = useApp();
  const [saveToast, setSaveToast] = useState(false);

  // New post modal state
  const [isAddPostOpen, setIsAddPostOpen] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const layoutOptions: { id: InstagramLayout; label: string; desc: string }[] = [
    {
      id: 'horizontal_carousel',
      label: 'Carrossel Horizontal Deslizável',
      desc: 'Formato stories/feed com rolagem lateral fluida e botões de navegação'
    },
    {
      id: 'grid_2_columns',
      label: 'Grade de 2 Colunas',
      desc: 'Cards quadrados grandes em pares, visual clean e espaçoso'
    },
    {
      id: 'grid_3_columns',
      label: 'Grade de 3 Colunas (Feed Clássico)',
      desc: 'Idêntico ao feed padrão do Instagram para celular'
    },
    {
      id: 'large_featured_post',
      label: 'Post Destaque Principal + Miniaturas',
      desc: 'Foto grande de capa em cima e miniaturas dos últimos cortes abaixo'
    },
    {
      id: 'mixed_editorial',
      label: 'Mosaico Editorial Assimétrico',
      desc: 'Layout sofisticado estilo revista com fotos em tamanhos variados'
    }
  ];

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl.trim()) return;

    addInstagramPost({
      imageUrl: newImageUrl.trim(),
      caption: newCaption.trim() || undefined,
      url: newUrl.trim() || instagram.profileUrl || `https://instagram.com/${instagram.username}`
    });

    setIsAddPostOpen(false);
    setNewImageUrl('');
    setNewCaption('');
    setNewUrl('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Integração & Feed do Instagram
          </h2>
          <p className="text-xs text-stone-400">
            Apresente fotos de cortes, barba e atmosfera da barbearia dentro do cartão digital
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Active switch */}
          <button
            onClick={() => updateInstagram({ enabled: !instagram.enabled })}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              instagram.enabled
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                : 'bg-stone-800 border-white/5 text-stone-400'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${instagram.enabled ? 'bg-emerald-400' : 'bg-stone-500'}`} />
            <span>{instagram.enabled ? 'Seção Ativa' : 'Seção Oculta'}</span>
          </button>

          <button
            onClick={handleSaveSettings}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#A8FF3E] hover:bg-[#97f02d] text-black font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
          >
            {saveToast ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Salvo!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Salvar Configurações</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Settings Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile and texts */}
        <div className="p-5 rounded-2xl bg-[#141414] border border-white/[0.08] space-y-4">
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <Instagram className="w-4 h-4 text-pink-400" />
            <span>Conta & Textos de Chamada</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Nome de Usuário (@instagram)
              </label>
              <input
                type="text"
                value={instagram.username}
                onChange={(e) => updateInstagram({ username: e.target.value })}
                placeholder="ex: barbershop.imperial"
                className="w-full py-2 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Link do Perfil Completo
              </label>
              <input
                type="url"
                value={instagram.profileUrl}
                onChange={(e) => updateInstagram({ profileUrl: e.target.value })}
                placeholder="https://instagram.com/..."
                className="w-full py-2 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Título da Seção
                </label>
                <input
                  type="text"
                  value={instagram.title}
                  onChange={(e) => updateInstagram({ title: e.target.value })}
                  placeholder="Siga nosso estilo"
                  className="w-full py-2 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Texto do Botão
                </label>
                <input
                  type="text"
                  value={instagram.buttonLabel}
                  onChange={(e) => updateInstagram({ buttonLabel: e.target.value })}
                  placeholder="Ver perfil no Instagram"
                  className="w-full py-2 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Subtítulo / Descrição
              </label>
              <textarea
                rows={2}
                value={instagram.subtitle}
                onChange={(e) => updateInstagram({ subtitle: e.target.value })}
                className="w-full py-2 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs resize-none"
              />
            </div>
          </div>
        </div>

        {/* Layout Options */}
        <div className="p-5 rounded-2xl bg-[#141414] border border-white/[0.08] space-y-4">
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#A8FF3E]" />
            <span>Estilo de Apresentação do Feed</span>
          </h3>

          <div className="space-y-2">
            {layoutOptions.map((opt) => {
              const isSelected = instagram.layout === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => updateInstagram({ layout: opt.id })}
                  className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#A8FF3E] bg-[#A8FF3E]/10 shadow'
                      : 'border-white/10 bg-stone-900/60 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">
                      {opt.label}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] font-bold text-black bg-[#A8FF3E] px-2 py-0.5 rounded-full">
                        Ativo
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-400 mt-1">
                    {opt.desc}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <label className="text-xs font-semibold text-stone-300">
              Limite Máximo de Fotos: {instagram.postsLimit || 6}
            </label>
            <input
              type="range"
              min={3}
              max={12}
              value={instagram.postsLimit || 6}
              onChange={(e) => updateInstagram({ postsLimit: Number(e.target.value) })}
              className="accent-[#A8FF3E] w-36"
            />
          </div>
        </div>
      </div>

      {/* Manual Posts Management */}
      <div className="p-5 rounded-2xl bg-[#141414] border border-white/[0.08] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#A8FF3E]" />
              <span>Fotos do Feed (Manual / Personalizado)</span>
            </h3>
            <p className="text-xs text-stone-400">
              Cadastre fotos dos melhores cortes e transformações para exibir no cartão
            </p>
          </div>

          <button
            onClick={() => setIsAddPostOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/15 text-white text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar Foto</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {(instagram.posts || []).map((post) => (
            <div
              key={post.id}
              className="relative aspect-square rounded-xl overflow-hidden bg-stone-900 border border-white/10 group"
            >
              <img
                src={post.imageUrl}
                alt={post.caption || 'Corte'}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                <button
                  onClick={() => deleteInstagramPost(post.id)}
                  className="self-end p-1.5 rounded-lg bg-rose-500/80 text-white hover:bg-rose-600 transition-colors"
                  title="Remover foto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                {post.caption && (
                  <p className="text-[10px] text-white truncate">{post.caption}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Add Photo */}
      {isAddPostOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#141414] border border-white/15 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white">Adicionar Foto ao Feed</h3>
              <button
                onClick={() => setIsAddPostOpen(false)}
                className="text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  URL da Imagem *
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://... ou caminho da imagem"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Legenda Curta
                </label>
                <input
                  type="text"
                  placeholder="Ex: Skin fade cirúrgico..."
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Link do Post no Instagram (Opcional)
                </label>
                <input
                  type="url"
                  placeholder="https://instagram.com/p/..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddPostOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#A8FF3E] text-black font-bold text-xs"
                >
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
