
import React, { useState, useEffect, useCallback } from 'react';
import { Room, RoomStatus, HistoryEvent, OccupationType, Transaction, Booking, BarItem, GlobalSettings, UserRole, UserProfile, Block, SubGroup } from './types';
import { INITIAL_ROOMS, INITIAL_BAR_ITEMS } from './constants';
import Dashboard from './views/Dashboard';
import BarPOS from './views/BarPOS';
import HistoryView from './views/HistoryView';
import CalendarView from './views/CalendarView';
import SettingsView from './views/SettingsView';
import ProfileView from './views/ProfileView';
import FinanceView from './views/FinanceView';
import Sidebar from './components/Sidebar';

const App: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem('terra_rooms');
    return saved ? JSON.parse(saved) : INITIAL_ROOMS;
  });

  const [inventory, setInventory] = useState<BarItem[]>(() => {
    const saved = localStorage.getItem('terra_inventory');
    return saved ? JSON.parse(saved) : INITIAL_BAR_ITEMS;
  });

  const [settings, setSettings] = useState<GlobalSettings>(() => {
    const saved = localStorage.getItem('terra_settings');
    return saved ? JSON.parse(saved) : { currency: 'FCFA', establishmentName: 'TerraGest Épure' };
  });

  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('terra_users');
    const defaultUser = {
      id: 'admin-1',
      role: UserRole.SUPER_ADMIN,
      firstName: 'Admin',
      lastName: 'Principal',
      contact: '+33 6 00 00 00 00',
      isValidated: true
    };
    return saved ? JSON.parse(saved) : [defaultUser];
  });

  const [blocks, setBlocks] = useState<Block[]>(() => {
    const saved = localStorage.getItem('terra_blocks');
    return saved ? JSON.parse(saved) : [];
  });

  const [subGroups, setSubGroups] = useState<SubGroup[]>(() => {
    const saved = localStorage.getItem('terra_subgroups');
    return saved ? JSON.parse(saved) : [];
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('terra_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  const [history, setHistory] = useState<HistoryEvent[]>(() => {
    const saved = localStorage.getItem('terra_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(users[0]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'calendar' | 'pos' | 'history' | 'settings' | 'profile' | 'finance'>('dashboard');

  useEffect(() => {
    localStorage.setItem('terra_rooms', JSON.stringify(rooms));
    localStorage.setItem('terra_inventory', JSON.stringify(inventory));
    localStorage.setItem('terra_settings', JSON.stringify(settings));
    localStorage.setItem('terra_users', JSON.stringify(users));
    localStorage.setItem('terra_blocks', JSON.stringify(blocks));
    localStorage.setItem('terra_subgroups', JSON.stringify(subGroups));
    localStorage.setItem('terra_bookings', JSON.stringify(bookings));
    localStorage.setItem('terra_history', JSON.stringify(history));
  }, [rooms, inventory, settings, users, blocks, subGroups, bookings, history]);

  const addHistoryEvent = useCallback((event: Omit<HistoryEvent, 'id' | 'timestamp' | 'checksum'>) => {
    const timestamp = Date.now();
    // Signature factice sécurisée pour l'intégrité
    const payload = JSON.stringify({ ...event, timestamp });
    const mockHash = btoa(payload).slice(-24);
    const newEvent: HistoryEvent = { 
      ...event, 
      id: crypto.randomUUID(), 
      timestamp, 
      checksum: `SIG-EPURE-${mockHash}` 
    };
    setHistory(prev => [newEvent, ...prev]);
  }, []);

  const handleCheckIn = (roomId: number, name: string, type: OccupationType, manualTimestamp: number, rate?: number) => {
    const now = Date.now();
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;

    // Détection d'anomalie de sécurité (Check-in avec plus de 24h de décalage)
    const timeDiff = Math.abs(now - manualTimestamp);
    if (timeDiff > 86400000) {
      addHistoryEvent({
        type: 'SECURITY_ALERT',
        description: `ATTENTION : Enregistrement rétroactif majeur détecté par ${currentUser.firstName} pour la Ch. ${room.number} (Écart: ${Math.round(timeDiff / 3600000)}h)`,
        roomId,
        user: 'SYSTEM_AUDIT'
      });
    }

    setRooms(prev => prev.map(r => {
      if (r.id === roomId) {
        let status = RoomStatus.OCCUPIED_CLIENT;
        if (type === OccupationType.MONTHLY) status = RoomStatus.OCCUPIED_RESIDENT;
        if (type === OccupationType.STAFF) status = RoomStatus.OCCUPIED_STAFF;

        return {
          ...r,
          status,
          occupantName: name,
          occupationType: type,
          checkInDate: manualTimestamp,
          monthlyRate: rate,
          barBill: []
        };
      }
      return r;
    }));

    if (type === OccupationType.MONTHLY) {
      const start = manualTimestamp;
      const end = new Date(start).setDate(new Date(start).getDate() + 30);
      setBookings(prev => [...prev, {
        id: crypto.randomUUID(),
        roomId,
        occupantName: name,
        type: OccupationType.MONTHLY,
        startDate: start,
        endDate: end,
        amount: rate
      }]);
    }

    addHistoryEvent({
      type: 'CHECK_IN',
      description: `Arrivée : ${name} (${type}) en Chambre ${room.number}`,
      roomId,
      amount: rate,
      user: currentUser.firstName
    });
  };

  const handleCheckOut = (roomId: number, totalAmount: number) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;

    setRooms(prev => prev.map(r => r.id === roomId ? {
      ...r,
      status: RoomStatus.CLEANING,
      occupantName: undefined,
      occupationType: undefined,
      checkInDate: undefined,
      monthlyRate: undefined,
      barBill: []
    } : r));

    addHistoryEvent({
      type: 'CHECK_OUT',
      description: `Départ : ${room.occupantName} de la Chambre ${room.number}`,
      roomId,
      amount: totalAmount,
      user: currentUser.firstName
    });
  };

  const handleSetCleaningDone = (roomId: number) => {
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, status: RoomStatus.FREE } : r));
    addHistoryEvent({
      type: 'STATUS_CHANGE',
      description: `Chambre ${rooms.find(r => r.id === roomId)?.number} prête (Nettoyage fini)`,
      roomId,
      user: currentUser.firstName
    });
  };

  const handleCompleteBarSale = (sale: { roomId?: number; items: Transaction[]; total: number }) => {
    setInventory(prev => prev.map(item => {
      const sold = sale.items.find(si => si.itemId === item.id);
      if (sold) {
        return { ...item, stockQuantity: item.stockQuantity - sold.quantity };
      }
      return item;
    }));

    if (sale.roomId) {
      setRooms(prev => prev.map(room => room.id === sale.roomId ? { ...room, barBill: [...room.barBill, ...sale.items] } : room));
    }

    addHistoryEvent({ 
      type: 'BAR_SALE', 
      description: `Vente bar ${sale.roomId ? `(Ch. ${sale.roomId})` : '(Comptoir)'} : ${sale.total.toFixed(0)} ${settings.currency}`, 
      roomId: sale.roomId, 
      amount: sale.total, 
      user: currentUser.firstName 
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        currentUser={currentUser} 
        onSwitchUser={setCurrentUser} 
      />
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8 flex justify-between items-center no-print">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-terracotta bg-gray-200 shadow-inner transition-transform hover:scale-110">
               {currentUser.photoUrl ? <img src={currentUser.photoUrl} alt="Profil" className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-gray-400"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg></div>}
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-800 tracking-tight">{settings.establishmentName} — <span className="text-terracotta">{currentUser.firstName}</span></h1>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${currentUser.role === UserRole.PERSONNEL ? 'bg-indigo-100 text-indigo-700' : 'bg-terracotta text-white'}`}>{currentUser.role.replace('_', ' ')}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div> Système Sécurisé</span>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto">
          {activeTab === 'dashboard' && (
            <Dashboard 
              rooms={rooms} 
              blocks={blocks} 
              subGroups={subGroups} 
              bookings={bookings} 
              onCheckIn={handleCheckIn} 
              onCheckOut={handleCheckOut} 
              onSetCleaningDone={handleSetCleaningDone} 
            />
          )}
          {activeTab === 'calendar' && <CalendarView rooms={rooms} bookings={bookings} onAddBooking={(b) => setBookings(prev => [...prev, { ...b, id: crypto.randomUUID() }])} />}
          {activeTab === 'pos' && (
            <BarPOS 
              rooms={rooms.filter(r => r.status.includes('OCCUPÉE'))} 
              items={inventory.filter(i => i.stockQuantity > 0)} 
              currency={settings.currency}
              onCompleteSale={handleCompleteBarSale} 
            />
          )}
          {activeTab === 'history' && <HistoryView history={history} />}
          {activeTab === 'finance' && <FinanceView inventory={inventory} history={history} settings={settings} />}
          {activeTab === 'settings' && (currentUser.role === UserRole.SUPER_ADMIN || currentUser.role === UserRole.GERANT) && (
            <SettingsView 
              rooms={rooms} 
              blocks={blocks} 
              subGroups={subGroups} 
              inventory={inventory}
              settings={settings}
              users={users}
              onUpdateRooms={setRooms} 
              onUpdateBlocks={setBlocks} 
              onUpdateSubGroups={setSubGroups} 
              onUpdateInventory={setInventory}
              onUpdateSettings={setSettings}
              onUpdateUsers={setUsers}
            />
          )}
          {activeTab === 'profile' && <ProfileView user={currentUser} onUpdateProfile={(p) => {
            setCurrentUser(p);
            setUsers(prev => prev.map(u => u.id === p.id ? p : u));
          }} />}
        </div>
      </main>
    </div>
  );
};

export default App;
