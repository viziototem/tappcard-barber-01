import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Calendar as CalendarIcon, Clock, Users, Scissors, MessageCircle, Check } from 'lucide-react';

export const BookingModal: React.FC = () => {
  const {
    isBookingModalOpen,
    closeBookingModal,
    selectedServiceForBooking,
    barbershop,
    services,
    bookingSettings,
    createBooking
  } = useApp();

  // Booking form state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [people, setPeople] = useState(1);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSuccess, setIsSuccess] = useState(false);

  // Generate next 7 selectable dates
  const availableDates = React.useMemo(() => {
    const list: { fullDate: string; dayName: string; dayNumber: string; isToday: boolean }[] = [];
    const now = new Date();
    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(now.getDate() + i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const fullDate = `${yyyy}-${mm}-${dd}`;
      list.push({
        fullDate,
        dayName: i === 0 ? 'Hoje' : i === 1 ? 'Amanhã' : dayNames[d.getDay()],
        dayNumber: String(d.getDate()),
        isToday: i === 0
      });
    }
    return list;
  }, []);

  // Generate available time slots based on settings
  const availableSlots = React.useMemo(() => {
    const slots: string[] = [];
    const [startH, startM] = (bookingSettings.openingTime || '09:00').split(':').map(Number);
    const [endH, endM] = (bookingSettings.closingTime || '20:00').split(':').map(Number);
    const interval = bookingSettings.intervalMinutes || 30;

    let current = startH * 60 + (startM || 0);
    const end = endH * 60 + (endM || 0);

    while (current < end) {
      const h = Math.floor(current / 60);
      const m = current % 60;
      slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
      current += interval;
    }
    return slots;
  }, [bookingSettings]);

  // Synchronize initial selections
  useEffect(() => {
    if (isBookingModalOpen) {
      setIsSuccess(false);
      if (selectedServiceForBooking) {
        setSelectedService(selectedServiceForBooking);
      } else if (services.length > 0) {
        setSelectedService(services[0].name);
      }
      if (availableDates.length > 0 && !selectedDate) {
        setSelectedDate(availableDates[0].fullDate);
      }
      if (availableSlots.length > 0 && !selectedTime) {
        setSelectedTime(availableSlots[0]);
      }
    }
  }, [isBookingModalOpen, selectedServiceForBooking, services, availableDates, availableSlots]);

  if (!isBookingModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!customerName.trim()) {
      newErrors.customerName = 'Por favor, informe seu nome.';
    }
    if (!selectedDate) {
      newErrors.selectedDate = 'Selecione uma data.';
    }
    if (!selectedTime) {
      newErrors.selectedTime = 'Selecione um horário.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Format human-readable date for WhatsApp message: DD/MM/YYYY
    const [y, m, d] = selectedDate.split('-');
    const formattedDate = `${d}/${m}/${y}`;

    // 1. Save booking to internal app state
    createBooking({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim() || undefined,
      date: selectedDate,
      time: selectedTime,
      people,
      service: selectedService || 'Corte e Estilo',
      notes: notes.trim() || undefined
    });

    // 2. Prepare dynamic WhatsApp message
    let message = bookingSettings.messageTemplate ||
      'Olá! Gostaria de agendar um horário na {barbershop_name}. Meu nome é {customer_name}. Data: {date}. Horário: {time}. Quantidade de pessoas: {people}. Serviço: {service}. Observação: {notes}.';

    message = message
      .replace(/{barbershop_name}/g, barbershop.name)
      .replace(/{customer_name}/g, customerName.trim())
      .replace(/{date}/g, formattedDate)
      .replace(/{time}/g, selectedTime)
      .replace(/{people}/g, String(people))
      .replace(/{service}/g, selectedService || 'Geral')
      .replace(/{notes}/g, notes.trim() || 'Nenhuma');

    // 3. Open WhatsApp
    const phone = (bookingSettings.whatsappNumber || barbershop.whatsapp).replace(/\D/g, '');
    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phone}?text=${encoded}`;

    setIsSuccess(true);

    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      closeBookingModal();
      setIsSuccess(false);
      setCustomerName('');
      setNotes('');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md transition-opacity">
      {/* Bottom Sheet Modal Container */}
      <div
        className="relative w-full max-w-lg bg-[#141414] border-t sm:border border-white/15 rounded-t-[26px] sm:rounded-[26px] max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-slideUp"
        style={{
          borderRadius: 'var(--border-radius)'
        }}
      >
        {/* Grab Handle for Mobile */}
        <div className="w-12 h-1.5 bg-stone-700 rounded-full mx-auto mt-3 mb-1 sm:hidden" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-black font-bold text-xs"
              style={{ backgroundColor: 'var(--accent-color)' }}
            >
              <CalendarIcon className="w-4 h-4 text-black" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight leading-tight">
                Agende seu Horário
              </h3>
              <p className="text-[11px] text-stone-400">
                Confirmação imediata via WhatsApp
              </p>
            </div>
          </div>

          <button
            onClick={closeBookingModal}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/[0.06] hover:bg-white/10 text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-4 my-auto">
            <div
              className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-black animate-bounce shadow-xl"
              style={{ backgroundColor: 'var(--accent-color)' }}
            >
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <h4 className="text-xl font-bold text-white">Agendamento Pronto!</h4>
            <p className="text-xs text-stone-300 max-w-xs mx-auto">
              Estamos abrindo o WhatsApp com os dados preenchidos para a equipe da {barbershop.name}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
            {/* 1. Service Selection */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-300">
                <Scissors className="w-3.5 h-3.5 text-stone-400" />
                <span>Escolha o Serviço</span>
              </label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full py-2.5 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs font-medium focus:border-[#A8FF3E] focus:outline-none transition-colors"
              >
                {services.filter(s => s.active).map((srv) => (
                  <option key={srv.id} value={srv.name} className="bg-stone-900 text-white">
                    {srv.name} — R$ {srv.price.toFixed(0)} ({srv.durationMinutes} min)
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Visual Date Selector */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-300">
                <CalendarIcon className="w-3.5 h-3.5 text-stone-400" />
                <span>Escolha a Data</span>
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                {availableDates.map((item) => {
                  const isSelected = selectedDate === item.fullDate;
                  return (
                    <button
                      type="button"
                      key={item.fullDate}
                      onClick={() => {
                        setSelectedDate(item.fullDate);
                        setErrors(prev => ({ ...prev, selectedDate: '' }));
                      }}
                      className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl transition-all border text-center cursor-pointer ${
                        isSelected
                          ? 'border-transparent text-black font-extrabold shadow-md'
                          : 'bg-stone-900/90 border-white/[0.08] text-stone-300 hover:border-white/20'
                      }`}
                      style={{
                        backgroundColor: isSelected ? 'var(--accent-color)' : undefined
                      }}
                    >
                      <span className={`text-[10px] ${isSelected ? 'text-black/80 font-bold' : 'text-stone-400'}`}>
                        {item.dayName}
                      </span>
                      <span className={`text-sm font-extrabold mt-0.5 ${isSelected ? 'text-black' : 'text-white'}`}>
                        {item.dayNumber}
                      </span>
                    </button>
                  );
                })}
              </div>
              {errors.selectedDate && (
                <p className="text-[11px] text-rose-400">{errors.selectedDate}</p>
              )}
            </div>

            {/* 3. Visual Time Slot Selector */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-300">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span>Horários Disponíveis</span>
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 max-h-36 overflow-y-auto pr-1">
                {availableSlots.map((slot) => {
                  const isSelected = selectedTime === slot;
                  return (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => {
                        setSelectedTime(slot);
                        setErrors(prev => ({ ...prev, selectedTime: '' }));
                      }}
                      className={`py-2 px-1 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'text-black font-bold border-transparent'
                          : 'bg-stone-900/90 border-white/[0.08] text-stone-300 hover:border-white/20'
                      }`}
                      style={{
                        backgroundColor: isSelected ? 'var(--accent-color)' : undefined
                      }}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
              {errors.selectedTime && (
                <p className="text-[11px] text-rose-400">{errors.selectedTime}</p>
              )}
            </div>

            {/* 4. Number of People Counter */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-300">
                <Users className="w-3.5 h-3.5 text-stone-400" />
                <span>Quantidade de Pessoas</span>
              </label>
              <div className="flex items-center justify-between p-2 rounded-xl bg-stone-900/90 border border-white/10">
                <span className="text-xs text-stone-400 pl-2">
                  {people === 1 ? '1 pessoa (Individual)' : `${people} pessoas`}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPeople(p => Math.max(1, p - 1))}
                    disabled={people <= 1}
                    className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/10 hover:bg-white/20 text-white font-bold disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-6 text-center text-sm font-bold text-white font-mono">
                    {people}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPeople(p => Math.min(bookingSettings.maxPeople || 5, p + 1))}
                    disabled={people >= (bookingSettings.maxPeople || 5)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/10 hover:bg-white/20 text-white font-bold disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* 5. Customer Name & Optional Phone */}
            <div className="space-y-2">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Seu Nome Completo *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Carlos Eduardo"
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    setErrors(prev => ({ ...prev, customerName: '' }));
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs placeholder:text-stone-600 focus:border-[#A8FF3E] focus:outline-none transition-colors"
                />
                {errors.customerName && (
                  <p className="text-[11px] text-rose-400 mt-1">{errors.customerName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Observações ou Barbeiro de preferência (opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Gostaria de alinhar a barba bem quadrada..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs placeholder:text-stone-600 focus:border-[#A8FF3E] focus:outline-none transition-colors resize-none"
                />
              </div>
            </div>

            {/* Confirm via WhatsApp CTA */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 font-bold text-sm tracking-tight text-black transition-all shadow-xl active:scale-[0.98] cursor-pointer"
                style={{
                  backgroundColor: 'var(--accent-color)',
                  borderRadius: 'var(--button-radius)'
                }}
              >
                <MessageCircle className="w-5 h-5 text-black stroke-[2.5]" />
                <span>Confirmar pelo WhatsApp</span>
              </button>
              <p className="text-center text-[10px] text-stone-500 mt-2">
                Você será redirecionado para enviar a mensagem diretamente para nossa barbearia.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
