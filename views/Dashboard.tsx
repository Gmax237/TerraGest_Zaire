
import React, { useState } from 'react';
import { Room, RoomStatus, OccupationType, Block, Booking, SubGroup } from '../types';
import { STATUS_COLORS, STATUS_DOTS } from '../constants';
import Modal from '../components/Modal';
import Invoice from '../components/Invoice';

interface RoomCardProps {
  room: Room;
  isSelected: boolean;
  isScheduled: boolean;
  onClick: (room: Room) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, isSelected, isScheduled, onClick }) => {
  const isOccupied = room.status.includes('OCCUPÉE');
  const isCleaning = room.status === RoomStatus.CLEANING;
  
  return (
    <button
      onClick={() => onClick(room)}
      className={`relative group p-6 rounded-[2.5rem] transition-all duration-500 flex flex-col items-start min-h-[180px] text-left ${
        isSelected 
          ? 'bg-terracotta text-white shadow-premium scale-[1.02]' 
          : 'bg-white hover:bg-terracotta-soft shadow-sm hover:shadow-xl'
      }`}
    >
      <div className="w-full flex justify-between items-start mb-6">
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-[0.15em] border ${
          isSelected ? 'border-white/30 text-white' : STATUS_COLORS[room.status]
        }`}>
          <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white animate-pulse' : STATUS_DOTS[room.status]}`}></div>
          {room.status}
        </div>
        {isScheduled && (
          <div className={`${isSelected ? 'text-white' : 'text-terracotta'} opacity-40`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
        )}
      </div>
      
      <div className="flex flex-col gap-1">
        <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isSelected ? 'text-white/60' : 'text-terracotta/40'}`}>
          № {room.number}
        </span>
        <h2 className={`text-xl font-bold tracking-tight leading-tight ${isSelected ? 'text-white' : 'text-gray-800'}`}>
          {room.name || 'Unité Standard'}
        </h2>
      </div>
      
      {isOccupied && (
        <div className={`mt-auto w-full pt-4 border-t ${isSelected ? 'border-white/10' : 'border-gray-50'}`}>
          <p className={`text-[9px] font-bold uppercase tracking-widest ${isSelected ? 'text-white/40' : 'text-gray-400'}`}>Occupant</p>
          <p className="text-sm font-bold truncate">{room.occupantName}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${isSelected ? 'bg-white/10' : 'bg-terracotta-light text-terracotta'}`}>
              {room.occupationType}
            </span>
          </div>
        </div>
      )}
      
      {!isOccupied && !isCleaning && (
        <div className="mt-auto opacity-0 group-hover:opacity-100 transition-opacity">
           <span className={`text-[10px] font-black uppercase tracking-widest ${isSelected ? 'text-white' : 'text-terracotta'}`}>Prendre Occupation →</span>
        </div>
      )}

      {isCleaning && (
        <div className="mt-auto">
           <span className="text-[10px] font-black uppercase tracking-widest text-yellow-600 animate-pulse">Nettoyage requis</span>
        </div>
      )}
    </button>
  );
};

interface DashboardProps {
  rooms: Room[];
  blocks: Block[];
  subGroups: SubGroup[];
  bookings: Booking[];
  onCheckIn: (roomId: number, name: string, type: OccupationType, manualTimestamp: number, rate?: number) => void;
  onCheckOut: (roomId: number, totalAmount: number) => void;
  onSetCleaningDone: (roomId: number) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ rooms, blocks, subGroups, bookings, onCheckIn, onCheckOut, onSetCleaningDone }) => {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [actionType, setActionType] = useState<'CHECKIN' | 'CHECKOUT' | 'CLEANING' | null>(null);
  
  // Form Check-in
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState<OccupationType>(OccupationType.NUITEE);
  const [formRate, setFormRate] = useState<number>(0);
  const [formDate, setFormDate] = useState<string>(new Date().toISOString().slice(0, 16));

  const resetForm = () => { 
    setSelectedRoom(null); 
    setActionType(null); 
    setFormName('');
    setFormType(OccupationType.NUITEE);
    setFormRate(0);
    setFormDate(new Date().toISOString().slice(0, 16));
  };

  const handleConfirmCheckIn = () => {
    if (!selectedRoom || !formName) return;
    const timestamp = new Date(formDate).getTime();
    onCheckIn(selectedRoom.id, formName, formType, timestamp, formRate);
    resetForm();
  };

  const checkIsScheduled = (room: Room) => {
    const now = Date.now();
    return bookings.some(b => b.roomId === room.id && now >= b.startDate && now <= b.endDate);
  };

  const openRoomAction = (room: Room) => {
    setSelectedRoom(room);
    if (room.status === RoomStatus.CLEANING) {
      setActionType('CLEANING');
    } else if (room.status.includes('OCCUPÉE')) {
      setActionType('CHECKOUT');
    } else {
      setActionType('CHECKIN');
    }
  };

  return (
    <div className="space-y-24 pb-32 animate-in fade-in duration-1000">
      {blocks.map(block => (
        <section key={block.id} className="relative">
          <div className="flex items-center gap-6 mb-12 px-2">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-terracotta uppercase tracking-[0.4em] mb-2">Bâtiment</span>
              <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">{block.name}</h2>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-terracotta/20 to-transparent"></div>
          </div>

          <div className="space-y-16">
            {subGroups.filter(s => s.blockId === block.id).map(sub => (
              <div key={sub.id} className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-terracotta"></div>
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">{sub.name}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {rooms.filter(r => r.blockId === block.id && r.subGroupId === sub.id).map(unit => (
                    <RoomCard key={unit.id} room={unit} isSelected={selectedRoom?.id === unit.id} isScheduled={checkIsScheduled(unit)} onClick={openRoomAction} />
                  ))}
                </div>
              </div>
            ))}
            
            {rooms.some(r => r.blockId === block.id && !r.subGroupId) && (
              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
                  <h3 className="text-xs font-black text-gray-300 uppercase tracking-[0.3em] italic">Unités directes</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {rooms.filter(r => r.blockId === block.id && !r.subGroupId).map(unit => (
                    <RoomCard key={unit.id} room={unit} isSelected={selectedRoom?.id === unit.id} isScheduled={checkIsScheduled(unit)} onClick={openRoomAction} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      ))}

      {rooms.some(r => !r.blockId) && (
        <section className="bg-terracotta-soft p-12 rounded-[4rem]">
          <div className="flex items-center gap-6 mb-12">
            <h2 className="text-3xl font-black text-terracotta/40 tracking-tighter uppercase">Parc Indépendant</h2>
            <div className="h-px flex-1 bg-terracotta/10"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {rooms.filter(r => !r.blockId).map(unit => (
              <RoomCard key={unit.id} room={unit} isSelected={selectedRoom?.id === unit.id} isScheduled={checkIsScheduled(unit)} onClick={openRoomAction} />
            ))}
          </div>
        </section>
      )}

      {selectedRoom && actionType === 'CHECKIN' && (
        <Modal title={`Enregistrement : Chambre ${selectedRoom.number}`} onClose={resetForm}>
           <div className="space-y-8">
              <div className="flex flex-col gap-6 bg-terracotta-soft/50 p-6 rounded-3xl border border-terracotta/5">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Date et Heure d'Entrée</label>
                  <input 
                    type="datetime-local" 
                    className="w-full bg-white border border-gray-100 px-5 py-4 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-terracotta/20 transition-all text-gray-700"
                    value={formDate}
                    onChange={e => setFormDate(e.target.value)}
                  />
                  <p className="text-[9px] text-terracotta font-medium mt-2 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    Journalisé avec signature de sécurité
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Identité de l'Occupant</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-50 border border-gray-100 px-5 py-4 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-terracotta/20 transition-all"
                  placeholder="Ex: Paul Biya"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Type de séjour</label>
                <div className="grid grid-cols-2 gap-4">
                  {[OccupationType.NUITEE, OccupationType.SIESTE, OccupationType.MONTHLY, OccupationType.STAFF].map(t => (
                    <button
                      key={t}
                      onClick={() => setFormType(t)}
                      className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                        formType === t ? 'bg-terracotta text-white border-terracotta shadow-lg' : 'bg-white text-gray-400 border-gray-100'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {(formType === OccupationType.MONTHLY || formType === OccupationType.NUITEE) && (
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Tarif Journalier / Mensuel ({formType})</label>
                  <input 
                    type="number" 
                    className="w-full bg-gray-50 border border-gray-100 px-5 py-4 rounded-2xl font-black text-terracotta text-xl"
                    value={formRate}
                    onChange={e => setFormRate(Number(e.target.value))}
                  />
                </div>
              )}

              <button 
                onClick={handleConfirmCheckIn}
                className="w-full bg-terracotta text-white py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-[0.2em] shadow-premium hover:bg-terracotta-dark transition-all transform active:scale-95"
              >
                Confirmer l'Occupation
              </button>
           </div>
        </Modal>
      )}

      {selectedRoom && actionType === 'CHECKOUT' && (
        <Modal title={`Facturation : Chambre ${selectedRoom.number}`} onClose={resetForm} size="lg">
           <Invoice room={selectedRoom} onPaid={() => {
             onCheckOut(selectedRoom.id, 0);
             resetForm();
           }} />
        </Modal>
      )}

      {selectedRoom && actionType === 'CLEANING' && (
        <Modal title={`Maintenance : Chambre ${selectedRoom.number}`} onClose={resetForm}>
           <div className="text-center space-y-8 py-4">
              <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-500 mx-auto animate-pulse">
                 <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
              </div>
              <p className="text-lg font-bold text-gray-600">Le ménage est-il terminé ?</p>
              <button 
                onClick={() => {
                  onSetCleaningDone(selectedRoom.id);
                  resetForm();
                }}
                className="w-full bg-green-500 text-white py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-[0.2em] shadow-lg hover:bg-green-600 transition-all"
              >
                Remettre en Location
              </button>
           </div>
        </Modal>
      )}
    </div>
  );
};

export default Dashboard;
