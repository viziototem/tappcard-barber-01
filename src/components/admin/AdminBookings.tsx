import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BookingRecord } from '../../types';
import {
  Calendar,
  Clock,
  Users,
  Search,
  CheckCircle,
  XCircle,
  Trash2,
  MessageCircle,
  Plus,
  Filter
} from 'lucide-react';

export const AdminBookings: React.FC = () => {
  const { bookings, updateBookingStatus, deleteBooking, createBooking, services } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New manual booking form
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTime, setNewTime] = useState('14:00');
  const [newService, setNewService] = useState(services[0]?.name || 'Corte Signature');
  const [newPeople, setNewPeople] = useState(1);
  const [newNotes, setNewNotes] = useState('');

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = filterStatus === 'all' || b.status === filterStatus;
    const matchesSearch =
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.date.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  const handleAddManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    createBooking({
      customerName: newName.trim(),
      customerPhone: newPhone.trim() || undefined,
      date: newDate,
      time: newTime,
      people: newPeople,
      service: newService,
      notes: newNotes.trim() || undefined
    });

    setIsAddModalOpen(false);
    setNewName('');
    setNewPhone('');
    setNewNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Gestão de Agendamentos
          </h2>
          <p className="text-xs text-stone-400">
            Acompanhe pedidos recebidos pelo WhatsApp e gerencie a agenda da barbearia
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#A8FF3E] hover:bg-[#97f02d] text-black font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-black stroke-[2.5]" />
          <span>Novo Agendamento Manual</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
          <input
            type="text"
            placeholder="Buscar por cliente, serviço ou data..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2.5 pl-10 pr-4 rounded-xl bg-[#141414] border border-white/10 text-white text-xs placeholder:text-stone-600 focus:border-[#A8FF3E] focus:outline-none"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#141414] border border-white/10 overflow-x-auto">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'pending', label: 'Pendentes' },
            { id: 'confirmed', label: 'Confirmados' },
            { id: 'completed', label: 'Concluídos' },
            { id: 'cancelled', label: 'Cancelados' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                filterStatus === tab.id
                  ? 'bg-white/15 text-white'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List / Table */}
      <div className="space-y-3">
        {filteredBookings.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#141414] border border-white/[0.08] space-y-2">
            <Calendar className="w-8 h-8 text-stone-600 mx-auto" />
            <p className="text-sm font-semibold text-stone-300">Nenhum agendamento encontrado</p>
            <p className="text-xs text-stone-500">Tente ajustar seus filtros ou cadastre um manualmente.</p>
          </div>
        ) : (
          filteredBookings.map((b) => (
            <div
              key={b.id}
              className="p-4 rounded-2xl bg-[#141414] border border-white/[0.08] hover:border-white/15 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              {/* Left Info */}
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2.5">
                  <h4 className="text-sm font-bold text-white">
                    {b.customerName}
                  </h4>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      b.status === 'confirmed'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : b.status === 'pending'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : b.status === 'completed'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {b.status === 'confirmed'
                      ? 'Confirmado'
                      : b.status === 'pending'
                      ? 'Pendente'
                      : b.status === 'completed'
                      ? 'Concluído'
                      : 'Cancelado'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-400">
                  <span className="text-white font-medium">{b.service}</span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-stone-500" />
                    {b.date.split('-').reverse().join('/')}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-stone-500" />
                    {b.time}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-stone-500" />
                    {b.people} {b.people === 1 ? 'pessoa' : 'pessoas'}
                  </span>
                </div>

                {b.notes && (
                  <p className="text-xs text-stone-400 italic bg-stone-900/60 p-2 rounded-lg border border-white/[0.04]">
                    Obs: "{b.notes}"
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-white/[0.06]">
                {b.customerPhone && (
                  <a
                    href={`https://wa.me/${b.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                      `Olá ${b.customerName}! Aqui é da barbearia confirmando seu agendamento para o dia ${b.date.split('-').reverse().join('/')} às ${b.time}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/20 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                )}

                {b.status === 'pending' && (
                  <button
                    onClick={() => updateBookingStatus(b.id, 'confirmed')}
                    className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors cursor-pointer"
                    title="Confirmar Agendamento"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                )}

                {b.status === 'confirmed' && (
                  <button
                    onClick={() => updateBookingStatus(b.id, 'completed')}
                    className="p-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors cursor-pointer"
                    title="Marcar como Concluído"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                )}

                {b.status !== 'cancelled' && (
                  <button
                    onClick={() => updateBookingStatus(b.id, 'cancelled')}
                    className="p-2 rounded-xl bg-stone-800 hover:bg-rose-500/20 hover:text-rose-400 text-stone-400 transition-colors cursor-pointer"
                    title="Cancelar Agendamento"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => deleteBooking(b.id)}
                  className="p-2 rounded-xl bg-stone-800 hover:bg-rose-500/20 hover:text-rose-400 text-stone-500 transition-colors cursor-pointer"
                  title="Excluir Registro"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Manual Booking Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#141414] border border-white/15 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white">Novo Agendamento Manual</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddManual} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Nome do Cliente *</label>
                <input
                  type="text"
                  required
                  placeholder="Nome do cliente"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">WhatsApp / Telefone</label>
                <input
                  type="text"
                  placeholder="(11) 99999-9999"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Data *</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Horário *</label>
                  <input
                    type="time"
                    required
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Serviço</label>
                <select
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} - R$ {s.price}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Pessoas</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={newPeople}
                  onChange={(e) => setNewPeople(Number(e.target.value))}
                  className="w-full py-2 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Observações</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#A8FF3E] text-black font-bold text-xs"
                >
                  Salvar Agendamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
