import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceItem } from '../../types';
import {
  Scissors,
  Plus,
  Edit2,
  Trash2,
  Check,
  Clock,
  Sparkles,
  Eye,
  EyeOff
} from 'lucide-react';

export const AdminServices: React.FC = () => {
  const { services, addService, updateService, deleteService } = useApp();
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(70);
  const [durationMinutes, setDurationMinutes] = useState(40);
  const [badge, setBadge] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const openNewModal = () => {
    setEditingService(null);
    setName('');
    setDescription('');
    setPrice(70);
    setDurationMinutes(40);
    setBadge('');
    setImageUrl('/src/assets/images/barber_cut_service_1791211088254.jpg');
    setIsModalOpen(true);
  };

  const openEditModal = (service: ServiceItem) => {
    setEditingService(service);
    setName(service.name);
    setDescription(service.description);
    setPrice(service.price);
    setDurationMinutes(service.durationMinutes);
    setBadge(service.badge || '');
    setImageUrl(service.imageUrl || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingService) {
      updateService(editingService.id, {
        name: name.trim(),
        description: description.trim(),
        price,
        durationMinutes,
        badge: badge.trim() || undefined,
        imageUrl: imageUrl.trim() || undefined
      });
    } else {
      addService({
        name: name.trim(),
        description: description.trim(),
        price,
        durationMinutes,
        badge: badge.trim() || undefined,
        imageUrl: imageUrl.trim() || '/src/assets/images/barber_cut_service_1791211088254.jpg',
        active: true
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Catálogo de Serviços & Preços
          </h2>
          <p className="text-xs text-stone-400">
            Adicione, edite valores, tempos e ative/desative opções exibidas no cartão
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#A8FF3E] hover:bg-[#97f02d] text-black font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-black stroke-[2.5]" />
          <span>Novo Serviço</span>
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            className={`p-4 rounded-2xl border transition-all space-y-3 ${
              service.active
                ? 'bg-[#141414] border-white/10'
                : 'bg-[#101010] border-white/[0.04] opacity-60'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-900 border border-white/10 shrink-0">
                  <img
                    src={service.imageUrl || '/src/assets/images/barber_cut_service_1791211088254.jpg'}
                    alt={service.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">
                      {service.name}
                    </h3>
                    {service.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#A8FF3E]/15 text-[#A8FF3E] border border-[#A8FF3E]/20">
                        {service.badge}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-400 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {service.durationMinutes} min
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-extrabold text-[#A8FF3E] font-mono">
                      R$ {service.price.toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => updateService(service.id, { active: !service.active })}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    service.active
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-stone-800 text-stone-500 border-white/5'
                  }`}
                  title={service.active ? 'Desativar serviço' : 'Ativar serviço'}
                >
                  {service.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => openEditModal(service)}
                  className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/10 text-stone-300 hover:text-white transition-colors"
                  title="Editar serviço"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => deleteService(service.id)}
                  className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-rose-500/20 text-stone-400 hover:text-rose-400 transition-colors"
                  title="Excluir serviço"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
              {service.description}
            </p>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#141414] border border-white/15 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingService ? 'Editar Serviço' : 'Novo Serviço'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Nome do Serviço *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Corte Masculino Degradê"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Preço (R$) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={1}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full py-2 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Duração (minutos) *
                  </label>
                  <input
                    type="number"
                    required
                    min={5}
                    step={5}
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full py-2 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Etiqueta / Badge de Destaque (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Mais Pedido, Exclusivo, Promoção"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  URL da Imagem
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Descrição dos Detalhes
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explique o que inclui o serviço..."
                  className="w-full py-2 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#A8FF3E] text-black font-bold text-xs"
                >
                  Salvar Serviço
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
