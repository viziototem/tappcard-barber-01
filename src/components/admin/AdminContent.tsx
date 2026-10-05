import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  FileText,
  MapPin,
  Phone,
  Clock,
  Sparkles,
  Check,
  Plus,
  Trash2,
  Image as ImageIcon
} from 'lucide-react';

export const AdminContent: React.FC<{ mode?: 'all' | 'story' | 'location' | 'contact' }> = ({ mode = 'all' }) => {
  const { barbershop, updateBarbershop } = useApp();
  const [saveToast, setSaveToast] = useState(false);

  // Local form state
  const [formData, setFormData] = useState(barbershop);

  useEffect(() => {
    setFormData(barbershop);
  }, [barbershop]);

  const handleChange = (field: keyof typeof barbershop, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleHoursChange = (index: number, key: 'days' | 'hours', val: string) => {
    const updated = [...formData.openingHours];
    updated[index][key] = val;
    setFormData(prev => ({ ...prev, openingHours: updated }));
  };

  const addHoursRow = () => {
    setFormData(prev => ({
      ...prev,
      openingHours: [...prev.openingHours, { days: 'Novo dia', hours: '09:00 às 19:00' }]
    }));
  };

  const removeHoursRow = (index: number) => {
    setFormData(prev => ({
      ...prev,
      openingHours: prev.openingHours.filter((_, i) => i !== index)
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateBarbershop(formData);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const getTitle = () => {
    switch (mode) {
      case 'story':
        return 'História & Storytelling da Barbearia';
      case 'location':
        return 'Localização, Mapa & Horários';
      case 'contact':
        return 'Contatos, Telefones & Redes Sociais';
      default:
        return 'Conteúdo & Informações da Barbearia';
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case 'story':
        return 'Edite a narrativa, foto do mestre barbeiro e valores da marca';
      case 'location':
        return 'Gerencie o endereço, links de GPS e horários de atendimento';
      case 'contact':
        return 'Atualize WhatsApp, telefones de chamada e perfis sociais';
      default:
        return 'Atualize textos institucionais, história, canais de contato e endereço';
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            {getTitle()}
          </h2>
          <p className="text-xs text-stone-400">
            {getSubtitle()}
          </p>
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#A8FF3E] hover:bg-[#97f02d] text-black font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
        >
          {saveToast ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Salvo com sucesso!</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Salvar Alterações</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Identidade Principal (shown if mode === 'all') */}
        {mode === 'all' && (
          <div className="p-5 rounded-2xl bg-[#141414] border border-white/[0.08] space-y-4">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#A8FF3E]" />
              <span>Identidade Principal</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Nome da Barbearia
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Slogan / Frase de Impacto
                </label>
                <input
                  type="text"
                  value={formData.slogan}
                  onChange={(e) => handleChange('slogan', e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Descrição Curta
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="w-full py-2 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Ano de Fundação
                  </label>
                  <input
                    type="number"
                    value={formData.foundedYear}
                    onChange={(e) => handleChange('foundedYear', Number(e.target.value))}
                    className="w-full py-2.5 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Nota Google (Score)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => handleChange('rating', Number(e.target.value))}
                    className="w-full py-2.5 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contato & Redes (shown if mode === 'all' or mode === 'contact') */}
        {(mode === 'all' || mode === 'contact') && (
          <div className="p-5 rounded-2xl bg-[#141414] border border-white/[0.08] space-y-4">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#A8FF3E]" />
              <span>Contatos & Redes Sociais</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  WhatsApp de Atendimento (com DDI e DDD)
                </label>
                <input
                  type="text"
                  placeholder="Ex: 5511987654321"
                  value={formData.whatsapp}
                  onChange={(e) => handleChange('whatsapp', e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs"
                />
                <span className="text-[10px] text-stone-500">
                  Apenas números (Ex: 5511999998888)
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Telefone Fixo / Celular (Exibição)
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Instagram (@perfil)
                </label>
                <input
                  type="text"
                  value={formData.instagram}
                  onChange={(e) => handleChange('instagram', e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Link de Avaliação Google (Google Reviews)
                </label>
                <input
                  type="url"
                  value={formData.googleReviewUrl}
                  onChange={(e) => handleChange('googleReviewUrl', e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* Localização & Endereço (shown if mode === 'all' or mode === 'location') */}
        {(mode === 'all' || mode === 'location') && (
          <div className="p-5 rounded-2xl bg-[#141414] border border-white/[0.08] space-y-4">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#A8FF3E]" />
              <span>Localização & Endereço</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Endereço Completo
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Bairro
                  </label>
                  <input
                    type="text"
                    value={formData.neighborhood}
                    onChange={(e) => handleChange('neighborhood', e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Cidade - UF
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Link do Google Maps (Rota Direta)
                </label>
                <input
                  type="url"
                  value={formData.googleMapsUrl}
                  onChange={(e) => handleChange('googleMapsUrl', e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* Horários de Funcionamento (shown if mode === 'all' or mode === 'location') */}
        {(mode === 'all' || mode === 'location') && (
          <div className="p-5 rounded-2xl bg-[#141414] border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#A8FF3E]" />
                <span>Horários de Atendimento</span>
              </h3>

              <button
                type="button"
                onClick={addHoursRow}
                className="flex items-center gap-1 text-xs text-[#A8FF3E] hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar linha</span>
              </button>
            </div>

            <div className="space-y-2">
              {formData.openingHours.map((slot, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={slot.days}
                    onChange={(e) => handleHoursChange(index, 'days', e.target.value)}
                    className="w-1/2 py-2 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs"
                    placeholder="Dias (ex: Seg a Sex)"
                  />
                  <input
                    type="text"
                    value={slot.hours}
                    onChange={(e) => handleHoursChange(index, 'hours', e.target.value)}
                    className="w-1/2 py-2 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs"
                    placeholder="Horário (ex: 09:00 às 20:00)"
                  />
                  <button
                    type="button"
                    onClick={() => removeHoursRow(index)}
                    className="p-2 text-stone-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* História e Storytelling (shown if mode === 'all' or mode === 'story') */}
        {(mode === 'all' || mode === 'story') && (
          <div className="md:col-span-2 p-5 rounded-2xl bg-[#141414] border border-white/[0.08] space-y-4">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#A8FF3E]" />
              <span>Nossa História (Storytelling Editorial)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Texto Completo da História
                  </label>
                  <textarea
                    rows={5}
                    value={formData.story}
                    onChange={(e) => handleChange('story', e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    URL da Imagem da História
                  </label>
                  <input
                    type="text"
                    value={formData.storyImageUrl}
                    onChange={(e) => handleChange('storyImageUrl', e.target.value)}
                    className="w-full py-2 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <span className="block text-xs font-semibold text-stone-300 mb-1">
                  Foto Atual
                </span>
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-stone-900 border border-white/10">
                  <img
                    src={formData.storyImageUrl || '/src/assets/images/barber_craftsman_story_1791211108272.jpg'}
                    alt="Foto da história"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};
