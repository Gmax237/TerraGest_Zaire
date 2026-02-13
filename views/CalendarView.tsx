
import React, { useState } from 'react';
import { Room, Booking, OccupationType } from '../types';
import Modal from '../components/Modal';

interface CalendarViewProps {
  rooms: Room[];
  bookings: Booking[];
  onAddBooking: (booking: Omit<Booking, 'id'>) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ rooms, bookings, onAddBooking }) => {
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    const d = new Date(2026, 0, 5); // Lundi 5 Janvier 2026
    return d;
  });
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ roomId: number; date: Date } | null>(null);
  
  // Form state
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState<OccupationType>(OccupationType.NUITEE);
  const [formStartTime, setFormStartTime] = useState("14:00");
  const [formEndTime, setFormEndTime] = useState("18:00");
  const [formDays, setFormDays] = useState(1);

  const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(currentWeekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  const nextWeek = () => {
    const d = new Date(currentWeekStart);
    d.setDate(d.getDate() + 7);
    setCurrentWeekStart(d);
  };

  const prevWeek = () => {
    const d = new Date(currentWeekStart);
    d.setDate(d.getDate() - 7);
    setCurrentWeekStart(d);
  };

  const getBookingsForRoomAndDate = (roomId: number, date: Date) => {
    const dayStart = new Date(date);
    dayStart.setHours(0,0,0,0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23,59,59,999);

    return bookings.filter(b => 
      b.roomId === roomId && 
      ((b.startDate >= dayStart.getTime() && b.startDate <= dayEnd.getTime()) ||
       (b.endDate >= dayStart.getTime() && b.endDate <= dayEnd.getTime()) ||
       (b.startDate <= dayStart.getTime() && b.endDate >= dayEnd.getTime()))
    ).sort((a, b) => a.startDate - b.startDate);
  };

  const handleCellClick = (roomId: number, date: Date) => {
    setSelectedSlot({ roomId, date });
    setFormName('');
    setFormDays(1);
    setFormStartTime(formType === OccupationType.SIESTE ? "14:00" : "12:00");
    setFormEndTime(formType === OccupationType.SIESTE ? "17:00" : "10:00");
    setShowAddModal(true);
  };

  const handleSaveBooking = () => {
    if (selectedSlot && formName) {
      const start = new Date(selectedSlot.date);
      const [sh, sm] = formStartTime.split(':').map(Number);
      start.setHours(sh, sm, 0, 0);

      const end = new Date(selectedSlot.date);
      if (formType === OccupationType.NUITEE) {
        end.setDate(end.getDate() + formDays);
      } else if (formType === OccupationType.MONTHLY) {
        end.setMonth(end.getMonth() + 1);
      }
      const [eh, em] = formEndTime.split(':').map(Number);
      end.setHours(eh, em, 0, 0);
      
      onAddBooking({
        roomId: selectedSlot.roomId,
        occupantName: formName,
        type: formType,
        startDate: start.getTime(),
        endDate: end.getTime(),
      });
      setShowAddModal(false);
    }
  };

  const getOccupationColor = (type: OccupationType) => {
    switch (type) {
      case OccupationType.SIESTE: return 'bg-orange-400 text-white';
      case OccupationType.NUITEE: return 'bg-terracotta text-white';
      case OccupationType.MONTHLY: return 'bg-blue-600 text-white';
      case OccupationType.STAFF: return 'bg-gray-500 text-white';
      default: return 'bg-gray-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-1 uppercase">Planning Hebdomadaire</h2>
          <p className="text-terracotta font-bold text-sm tracking-wide">
            {currentWeekStart.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex bg-gray-50 p-1.5 rounded-2xl gap-1">
          <button onClick={prevWeek} className="p-3 bg-white text-terracotta rounded-xl hover:bg-terracotta hover:text-white transition-all shadow-sm active:scale-95">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={() => setCurrentWeekStart(new Date(2026, 0, 5))} className="px-6 py-3 bg-white text-gray-400 text-xs font-black uppercase tracking-widest rounded-xl hover:text-terracotta transition-all shadow-sm active:scale-95">
            Aujourd'hui
          </button>
          <button onClick={nextWeek} className="p-3 bg-white text-terracotta rounded-xl hover:bg-terracotta hover:text-white transition-all shadow-sm active:scale-95">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50/70">
                <th className="p-6 text-left border-b border-r border-gray-100 min-w-[140px]">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Chambre</span>
                </th>
                {daysOfWeek.map((date, i) => (
                  <th key={i} className="p-6 text-center border-b border-gray-100 min-w-[160px]">
                    <p className="text-[10px] font-black text-terracotta/60 uppercase tracking-widest mb-1">{date.toLocaleDateString('fr-FR', { weekday: 'long' })}</p>
                    <p className="text-2xl font-black text-gray-900 leading-none">{date.getDate()}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rooms.map(room => (
                <tr key={room.id} className="group h-32">
                  <td className="p-6 font-black text-gray-800 border-r border-gray-100 bg-gray-50/30 group-hover:bg-terracotta-light/20 transition-colors">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-400 font-bold uppercase tracking-tighter mb-1">Room</span>
                      <span className="text-2xl tracking-tighter">{room.number}</span>
                    </div>
                  </td>
                  {daysOfWeek.map((date, i) => {
                    const dayBookings = getBookingsForRoomAndDate(room.id, date);
                    
                    return (
                      <td 
                        key={i} 
                        className="p-3 border-b border-gray-100 relative group/cell h-full min-h-[120px] align-top"
                        onClick={() => handleCellClick(room.id, date)}
                      >
                        <div className="space-y-2 h-full min-h-[100px] flex flex-col justify-start">
                          {dayBookings.length > 0 ? (
                            dayBookings.map((b, idx) => {
                              const bDate = new Date(b.startDate);
                              const isToday = bDate.getDate() === date.getDate();
                              return (
                                <div 
                                  key={idx} 
                                  className={`rounded-xl p-2 shadow-sm transition-all hover:scale-[1.03] cursor-pointer ${getOccupationColor(b.type)}`}
                                  title={`${b.occupantName} (${b.type})`}
                                >
                                  <p className="text-[9px] font-black uppercase tracking-tight truncate leading-tight">
                                    {b.occupantName}
                                  </p>
                                  <p className="text-[8px] opacity-80 font-bold">
                                    {new Date(b.startDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                    {b.type === OccupationType.SIESTE ? ` - ${new Date(b.endDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}` : ''}
                                  </p>
                                </div>
                              );
                            })
                          ) : (
                            <div className="h-full w-full rounded-2xl border-2 border-dashed border-transparent group-hover/cell:border-terracotta/20 flex items-center justify-center transition-all opacity-0 group-hover/cell:opacity-100 bg-terracotta/5">
                              <span className="text-[10px] font-black text-terracotta uppercase tracking-widest">Réserver</span>
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-wrap gap-6 items-center justify-center py-4 bg-white/40 rounded-[2rem] border border-white/50 backdrop-blur-sm">
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-lg bg-orange-400 shadow-sm shadow-orange-100"></div> <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Sieste</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-lg bg-terracotta shadow-sm shadow-terracotta/20"></div> <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Nuitée</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-lg bg-blue-600 shadow-sm shadow-blue-100"></div> <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Mensuel</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-lg bg-gray-500 shadow-sm shadow-gray-100"></div> <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Personnel</span></div>
      </div>

      {showAddModal && selectedSlot && (
        <Modal title={`Planifier Ch. ${rooms.find(r => r.id === selectedSlot.roomId)?.number}`} onClose={() => setShowAddModal(false)} size="lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
               <div>
                <p className="text-[10px] font-black text-terracotta uppercase tracking-[0.2em] mb-4">Informations Client</p>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Nom complet</label>
                <input 
                  type="text" 
                  autoFocus
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-[1.25rem] outline-none focus:ring-2 focus:ring-terracotta/50 font-bold text-gray-800 placeholder:text-gray-300 transition-all"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ex: Paul Martin"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Type d'occupation</label>
                <div className="grid grid-cols-2 gap-3">
                  {[OccupationType.NUITEE, OccupationType.SIESTE, OccupationType.MONTHLY, OccupationType.STAFF].map(type => (
                    <button
                      key={type}
                      onClick={() => setFormType(type)}
                      className={`py-4 rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest border transition-all ${
                        formType === type 
                        ? 'bg-terracotta text-white border-terracotta shadow-lg shadow-terracotta/20' 
                        : 'bg-white text-gray-400 border-gray-100 hover:border-terracotta/30'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-[10px] font-black text-terracotta uppercase tracking-[0.2em] mb-4">Horodatage Précis</p>
              
              <div className="bg-gray-50 p-6 rounded-[1.5rem] space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Début</label>
                    <input 
                      type="time" 
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none font-bold text-gray-800"
                      value={formStartTime}
                      onChange={(e) => setFormStartTime(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Fin {formType === OccupationType.NUITEE ? `(+${formDays}j)` : ''}</label>
                    <input 
                      type="time" 
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none font-bold text-gray-800"
                      value={formEndTime}
                      onChange={(e) => setFormEndTime(e.target.value)}
                    />
                  </div>
                </div>

                {formType === OccupationType.NUITEE && (
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Nombre de Nuitées</label>
                    <input 
                      type="number" 
                      min="1"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none font-bold text-gray-800"
                      value={formDays}
                      onChange={(e) => setFormDays(Number(e.target.value))}
                    />
                  </div>
                )}
              </div>

              <div className="pt-4">
                <button 
                  onClick={handleSaveBooking}
                  className="w-full bg-gray-900 text-white py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-gray-200 hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  Confirmer au planning
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CalendarView;
