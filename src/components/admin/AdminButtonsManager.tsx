import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ButtonItem, ButtonType, ButtonStyle } from '../../types';
import {
  Link2,
  Plus,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  Edit2,
  Sparkles,
  Wifi,
  QrCode,
  MessageCircle,
  Instagram,
  Calendar,
  MapPin,
  Star,
  PhoneCall,
  Globe,
  Mail,
  Share2,
  GripVertical,
  Check
} from 'lucide-react';

const ICON_OPTIONS = [
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
  { id: 'instagram', label: 'Instagram', icon: Instagram },
  { id: 'calendar', label: 'Agendamento / Calendário', icon: Calendar },
  { id: 'location', label: 'Localização / Mapa', icon: MapPin },
  { id: 'star', label: 'Avaliação / Estrela', icon: Star },
  { id: 'phone', label: 'Telefone / Chamada', icon: PhoneCall },
  { id: 'wifi', label: 'Wi-Fi', icon: Wifi },
  { id: 'pix', label: 'PIX / Pagamento', icon: QrCode },
  { id: 'link', label: 'Link Genérico', icon: Link2 },
  { id: 'website', label: 'Website / Globo', icon: Globe },
  { id: 'email', label: 'E-mail / Carta', icon: Mail },
  { id: 'facebook', label: 'Rede Social / Compartilhar', icon: Share2 }
];

export const AdminButtonsManager: React.FC = () => {
  const {
    buttons,
    addButton,
    updateButton,
    deleteButton,
    duplicateButton,
    toggleButtonVisibility,
    reorderButtons
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBtn, setEditingBtn] = useState<ButtonItem | null>(null);
  const [saveToast, setSaveToast] = useState(false);

  // Form State
  const [label, setLabel] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [url, setUrl] = useState('');
  const [icon, setIcon] = useState('whatsapp');
  const [type, setType] = useState<ButtonType>('whatsapp');
  const [style, setStyle] = useState<ButtonStyle>('glass');
  const [badge, setBadge] = useState('');
  const [wifiName, setWifiName] = useState('BarberShop_Imperial_5G');
  const [wifiPass, setWifiPass] = useState('navalhaeestilo');
  const [pixKey, setPixKey] = useState('11987654321');
  const [pixDesc, setPixDesc] = useState('Chave Celular');
  const [pixRecipient, setPixRecipient] = useState('BarberShop Imperial');

  // Drag and Drop reordering state
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  const openCreateModal = () => {
    setEditingBtn(null);
    setLabel('');
    setSubtitle('');
    setUrl('');
    setIcon('link');
    setType('custom_url');
    setStyle('glass');
    setBadge('');
    setWifiName('BarberShop_Imperial_5G');
    setWifiPass('navalhaeestilo');
    setPixKey('11987654321');
    setPixDesc('Chave Celular');
    setPixRecipient('BarberShop Imperial');
    setIsModalOpen(true);
  };

  const openEditModal = (btn: ButtonItem) => {
    setEditingBtn(btn);
    setLabel(btn.label);
    setSubtitle(btn.subtitle || '');
    setUrl(btn.url || '');
    setIcon(btn.icon);
    setType(btn.type);
    setStyle(btn.style);
    setBadge(btn.badge || '');
    if (btn.wifiConfig) {
      setWifiName(btn.wifiConfig.networkName || '');
      setWifiPass(btn.wifiConfig.password || '');
    }
    if (btn.pixConfig) {
      setPixKey(btn.pixConfig.key || '');
      setPixDesc(btn.pixConfig.description || '');
      setPixRecipient(btn.pixConfig.recipientName || '');
    }
    setIsModalOpen(true);
  };

  const handleSaveButton = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;

    const payload: Omit<ButtonItem, 'id' | 'order'> = {
      label: label.trim(),
      subtitle: subtitle.trim() || undefined,
      url: url.trim() || undefined,
      icon,
      type,
      style,
      active: true,
      badge: badge.trim() || undefined,
      wifiConfig:
        type === 'wifi'
          ? { networkName: wifiName.trim(), password: wifiPass.trim() }
          : undefined,
      pixConfig:
        type === 'pix'
          ? {
              key: pixKey.trim(),
              description: pixDesc.trim(),
              recipientName: pixRecipient.trim()
            }
          : undefined
    };

    if (editingBtn) {
      updateButton(editingBtn.id, payload);
    } else {
      addButton(payload);
    }

    setIsModalOpen(false);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const moveUp = (idx: number) => {
    if (idx > 0) {
      reorderButtons(idx, idx - 1);
    }
  };

  const moveDown = (idx: number) => {
    if (idx < buttons.length - 1) {
      reorderButtons(idx, idx + 1);
    }
  };

  const handleDragStart = (idx: number) => {
    setDraggedIdx(idx);
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === idx) return;
    reorderButtons(draggedIdx, idx);
    setDraggedIdx(idx);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Gerenciar Botões & Links de Ação
          </h2>
          <p className="text-xs text-stone-400">
            Adicione, edite, oculte ou reordene todos os atalhos rápidos da página pública
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#A8FF3E] hover:bg-[#97f02d] text-black font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-black stroke-[2.5]" />
          <span>Novo Botão de Ação</span>
        </button>
      </div>

      {saveToast && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>Alterações salvas com sucesso!</span>
        </div>
      )}

      {/* Button Cards List with Drag and Drop */}
      <div className="space-y-2.5">
        {buttons.map((btn, index) => {
          const matchedIcon = ICON_OPTIONS.find(i => i.id === btn.icon.toLowerCase())?.icon || Link2;
          const IconComp = matchedIcon;

          return (
            <div
              key={btn.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                btn.active
                  ? 'bg-[#141414] border-white/10 hover:border-white/20'
                  : 'bg-[#101010] border-white/[0.04] opacity-50'
              }`}
            >
              {/* Left Drag Handle + Info */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="cursor-grab active:cursor-grabbing text-stone-500 hover:text-white p-1"
                  title="Arraste para reordenar"
                >
                  <GripVertical className="w-4 h-4" />
                </div>

                <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0">
                  <IconComp className="w-5 h-5 text-white" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-bold text-white truncate">
                      {btn.label}
                    </h4>
                    {btn.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#A8FF3E]/15 text-[#A8FF3E] border border-[#A8FF3E]/30">
                        {btn.badge}
                      </span>
                    )}
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.05] text-stone-400 uppercase">
                      {btn.type}
                    </span>
                  </div>
                  {btn.subtitle && (
                    <p className="text-xs text-stone-400 truncate mt-0.5">
                      {btn.subtitle}
                    </p>
                  )}
                  {btn.type === 'wifi' && btn.wifiConfig && (
                    <p className="text-[11px] text-stone-500 font-mono">
                      Rede: {btn.wifiConfig.networkName} · Senha: {btn.wifiConfig.password}
                    </p>
                  )}
                  {btn.type === 'pix' && btn.pixConfig && (
                    <p className="text-[11px] text-stone-500 font-mono">
                      Chave PIX: {btn.pixConfig.key}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons: Move, Visibility, Edit, Duplicate, Delete */}
              <div className="flex items-center gap-1.5 self-end sm:self-center">
                {/* Move Up/Down Controls (Touch friendly) */}
                <div className="flex items-center bg-white/[0.04] rounded-lg p-0.5 border border-white/5 mr-1">
                  <button
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="p-1.5 rounded text-stone-400 hover:text-white disabled:opacity-30 cursor-pointer"
                    title="Mover para cima"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => moveDown(index)}
                    disabled={index === buttons.length - 1}
                    className="p-1.5 rounded text-stone-400 hover:text-white disabled:opacity-30 cursor-pointer"
                    title="Mover para baixo"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Visibility Toggle */}
                <button
                  onClick={() => toggleButtonVisibility(btn.id)}
                  className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                    btn.active
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-stone-800 text-stone-500 border-white/5'
                  }`}
                  title={btn.active ? 'Ocultar na página pública' : 'Exibir na página pública'}
                >
                  {btn.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>

                {/* Edit */}
                <button
                  onClick={() => openEditModal(btn)}
                  className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/10 text-stone-300 hover:text-white transition-colors cursor-pointer"
                  title="Editar botão"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                {/* Duplicate */}
                <button
                  onClick={() => duplicateButton(btn.id)}
                  className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/10 text-stone-300 hover:text-white transition-colors cursor-pointer"
                  title="Duplicar botão"
                >
                  <Copy className="w-4 h-4" />
                </button>

                {/* Delete */}
                <button
                  onClick={() => deleteButton(btn.id)}
                  className="p-2 rounded-xl bg-white/[0.05] hover:bg-rose-500/20 text-stone-400 hover:text-rose-400 transition-colors cursor-pointer"
                  title="Excluir botão"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#141414] border border-white/15 rounded-2xl p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingBtn ? 'Editar Botão de Ação' : 'Criar Novo Botão de Ação'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveButton} className="space-y-4">
              {/* Type Selector */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Tipo de Ação / Função
                </label>
                <select
                  value={type}
                  onChange={(e) => {
                    const newType = e.target.value as ButtonType;
                    setType(newType);
                    if (newType === 'wifi') setIcon('wifi');
                    if (newType === 'pix') setIcon('pix');
                    if (newType === 'whatsapp') setIcon('whatsapp');
                    if (newType === 'instagram') setIcon('instagram');
                    if (newType === 'booking') setIcon('calendar');
                    if (newType === 'location') setIcon('location');
                    if (newType === 'reviews') setIcon('star');
                    if (newType === 'call') setIcon('phone');
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs font-semibold"
                >
                  <option value="whatsapp">WhatsApp (Mensagem Direta)</option>
                  <option value="booking">Agendamento (Abre Calendário)</option>
                  <option value="instagram">Instagram da Barbearia</option>
                  <option value="location">Localização (Google Maps)</option>
                  <option value="reviews">Avaliações do Google</option>
                  <option value="call">Ligar pelo Telefone</option>
                  <option value="wifi">Especial: Senha do Wi-Fi (Modal)</option>
                  <option value="pix">Especial: Chave PIX (Modal)</option>
                  <option value="custom_url">Link Externo Customizado</option>
                </select>
              </div>

              {/* Title & Subtitle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Título do Botão *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Fale Conosco"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Subtítulo (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Atendimento rápido"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs"
                  />
                </div>
              </div>

              {/* Icon Selector Grid */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Ícone do Botão
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {ICON_OPTIONS.map((item) => {
                    const ItemIcon = item.icon;
                    const isSelected = icon === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setIcon(item.id)}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#A8FF3E] bg-[#A8FF3E]/10 text-[#A8FF3E]'
                            : 'border-white/10 bg-stone-900 hover:border-white/20 text-stone-400 hover:text-white'
                        }`}
                      >
                        <ItemIcon className="w-4 h-4 mb-1" />
                        <span className="text-[9px] truncate w-full">{item.label.split('/')[0].trim()}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Style & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Estilo Visual
                  </label>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value as ButtonStyle)}
                    className="w-full py-2 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs"
                  >
                    <option value="glass">Glass (Superfície escura com brilho)</option>
                    <option value="primary">Primário (Destaque Neon)</option>
                    <option value="secondary">Secundário (Cinza Escuro)</option>
                    <option value="outline">Contorno (Borda fina)</option>
                    <option value="minimal">Minimalista</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Etiqueta de Destaque / Badge (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Novo, 5G, Grátis"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs"
                  />
                </div>
              </div>

              {/* Special Fields: Wi-Fi */}
              {type === 'wifi' && (
                <div className="p-3.5 rounded-xl bg-stone-900/90 border border-white/10 space-y-3">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Wifi className="w-3.5 h-3.5 text-[#A8FF3E]" />
                    <span>Configuração da Rede Wi-Fi</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1">Nome da Rede (SSID)</label>
                      <input
                        type="text"
                        value={wifiName}
                        onChange={(e) => setWifiName(e.target.value)}
                        className="w-full py-1.5 px-2.5 rounded-lg bg-black/60 border border-white/10 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1">Senha de Acesso</label>
                      <input
                        type="text"
                        value={wifiPass}
                        onChange={(e) => setWifiPass(e.target.value)}
                        className="w-full py-1.5 px-2.5 rounded-lg bg-black/60 border border-white/10 text-white text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Special Fields: PIX */}
              {type === 'pix' && (
                <div className="p-3.5 rounded-xl bg-stone-900/90 border border-white/10 space-y-3">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <QrCode className="w-3.5 h-3.5 text-[#A8FF3E]" />
                    <span>Configuração da Chave PIX</span>
                  </h4>
                  <div>
                    <label className="block text-[11px] text-stone-400 mb-1">Chave PIX (Telefone, CNPJ, E-mail ou Aleatória)</label>
                    <input
                      type="text"
                      value={pixKey}
                      onChange={(e) => setPixKey(e.target.value)}
                      className="w-full py-1.5 px-2.5 rounded-lg bg-black/60 border border-white/10 text-white text-xs font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1">Descrição</label>
                      <input
                        type="text"
                        value={pixDesc}
                        onChange={(e) => setPixDesc(e.target.value)}
                        placeholder="Ex: Chave Celular"
                        className="w-full py-1.5 px-2.5 rounded-lg bg-black/60 border border-white/10 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1">Nome do Favorecido</label>
                      <input
                        type="text"
                        value={pixRecipient}
                        onChange={(e) => setPixRecipient(e.target.value)}
                        placeholder="Ex: BarberShop Imperial"
                        className="w-full py-1.5 px-2.5 rounded-lg bg-black/60 border border-white/10 text-white text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Custom URL */}
              {type === 'custom_url' && (
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Link de Destino (URL) *
                  </label>
                  <input
                    type="url"
                    placeholder="https://exemplo.com.br"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs"
                  />
                </div>
              )}

              {/* Modal Buttons */}
              <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#A8FF3E] text-black font-bold text-xs shadow-md"
                >
                  Salvar Botão
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
