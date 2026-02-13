
import React, { useState } from 'react';
import { Room, UnitType, RoomStatus, Block, SubGroup, BarItem, GlobalSettings, UserProfile, UserRole } from '../types';

interface SettingsViewProps {
  rooms: Room[];
  blocks: Block[];
  subGroups: SubGroup[];
  inventory: BarItem[];
  settings: GlobalSettings;
  users: UserProfile[];
  onUpdateRooms: (rooms: Room[]) => void;
  onUpdateBlocks: (blocks: Block[]) => void;
  onUpdateSubGroups: (subGroups: SubGroup[]) => void;
  onUpdateInventory: (items: BarItem[]) => void;
  onUpdateSettings: (settings: GlobalSettings) => void;
  onUpdateUsers: (users: UserProfile[]) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ 
  rooms, blocks, subGroups, inventory, settings, users,
  onUpdateRooms, onUpdateBlocks, onUpdateSubGroups, onUpdateInventory, onUpdateSettings, onUpdateUsers
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'general' | 'infrastructure' | 'inventory' | 'users'>('general');

  // Inventory logic
  const [newBeverage, setNewBeverage] = useState<Partial<BarItem>>({
    name: '', category: 'Bière', purchasePriceBatch: 0, batchSize: 24, costPriceUnit: 0, price: 0, stockQuantity: 0, minStockLevel: 5
  });

  // New User logic
  const [newUser, setNewUser] = useState<Partial<UserProfile>>({
    firstName: '', lastName: '', role: UserRole.PERSONNEL, contact: '', isValidated: false
  });

  const calculateCost = (batchPrice: number, size: number) => size > 0 ? Number((batchPrice / size).toFixed(2)) : 0;

  const handleAddBeverage = () => {
    if (!newBeverage.name) return;
    const item: BarItem = {
      ...newBeverage as BarItem,
      id: crypto.randomUUID(),
      costPriceUnit: calculateCost(newBeverage.purchasePriceBatch || 0, newBeverage.batchSize || 1),
      lastRestockDate: Date.now()
    };
    onUpdateInventory([...inventory, item]);
    setNewBeverage({ name: '', category: 'Bière', purchasePriceBatch: 0, batchSize: 24, costPriceUnit: 0, price: 0, stockQuantity: 0, minStockLevel: 5 });
  };

  const handleAddUser = () => {
    if (!newUser.firstName || !newUser.lastName) return;
    const profile: UserProfile = {
      ...newUser as UserProfile,
      id: `user-${Date.now()}`,
      isValidated: false
    };
    onUpdateUsers([...users, profile]);
    setNewUser({ firstName: '', lastName: '', role: UserRole.PERSONNEL, contact: '', isValidated: false });
  };

  const handleRestock = (id: string, qty: number) => {
    onUpdateInventory(inventory.map(item => 
      item.id === id ? { ...item, stockQuantity: item.stockQuantity + qty, lastRestockDate: Date.now() } : item
    ));
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN: return 'bg-red-100 text-red-700';
      case UserRole.GERANT: return 'bg-terracotta text-white';
      case UserRole.PERSONNEL: return 'bg-indigo-100 text-indigo-700';
      case UserRole.CLIENT: return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-10 pb-24 animate-in fade-in duration-500">
      <div className="flex gap-4 border-b border-gray-100 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'general', label: 'Général' },
          { id: 'infrastructure', label: 'Structure' },
          { id: 'inventory', label: 'Stocks & Tarifs' },
          { id: 'users', label: 'Utilisateurs & Profils' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              activeSubTab === tab.id ? 'text-terracotta border-b-2 border-terracotta' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeSubTab === 'general' && (
        <section className="bg-white p-10 rounded-[3rem] shadow-premium border border-gray-50 max-w-2xl">
          <h2 className="text-2xl font-black text-gray-900 mb-8 uppercase tracking-tighter text-terracotta">Configuration Système</h2>
          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Devise Utilisée</label>
              <input 
                type="text" 
                className="w-full bg-gray-50 border border-gray-100 px-5 py-4 rounded-2xl font-black text-lg text-terracotta outline-none focus:ring-2 focus:ring-terracotta/20 transition-all"
                value={settings.currency} 
                onChange={e => onUpdateSettings({...settings, currency: e.target.value})}
                placeholder="Ex: FCFA, €, $"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Nom de l'Établissement</label>
              <input 
                type="text" 
                className="w-full bg-gray-50 border border-gray-100 px-5 py-4 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-terracotta/20 transition-all"
                value={settings.establishmentName} 
                onChange={e => onUpdateSettings({...settings, establishmentName: e.target.value})}
              />
            </div>
          </div>
        </section>
      )}

      {activeSubTab === 'users' && (
        <div className="space-y-12">
           <section className="bg-white p-10 rounded-[3rem] shadow-premium border border-gray-50">
            <h2 className="text-2xl font-black text-gray-900 mb-8 uppercase tracking-tighter text-terracotta">Créer un Profil</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Prénom</label>
                <input type="text" className="w-full bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl font-bold" value={newUser.firstName} onChange={e => setNewUser({...newUser, firstName: e.target.value})} />
              </div>
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Nom</label>
                <input type="text" className="w-full bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl font-bold" value={newUser.lastName} onChange={e => setNewUser({...newUser, lastName: e.target.value})} />
              </div>
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Rôle Système</label>
                <select className="w-full bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl font-bold text-xs" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value as UserRole})}>
                  <option value={UserRole.CLIENT}>Client / Résident</option>
                  <option value={UserRole.PERSONNEL}>Personnel Hôtelier</option>
                  <option value={UserRole.GERANT}>Gérant</option>
                </select>
              </div>
              <div className="flex items-end">
                <button onClick={handleAddUser} className="w-full bg-terracotta text-white py-3 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg hover:bg-terracotta-dark transition-all">Affecter au Système</button>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-[3rem] shadow-premium border border-gray-50 overflow-hidden">
             <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-terracotta-soft/50">
                      <th className="px-8 py-6 text-[10px] font-black text-terracotta uppercase tracking-widest">Utilisateur</th>
                      <th className="px-6 py-6 text-[10px] font-black text-terracotta uppercase tracking-widest text-center">Rôle</th>
                      <th className="px-6 py-6 text-[10px] font-black text-terracotta uppercase tracking-widest text-center">Statut Doc.</th>
                      <th className="px-8 py-6 text-[10px] font-black text-terracotta uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                              {u.photoUrl ? <img src={u.photoUrl} className="w-full h-full object-cover" /> : <svg className="w-6 h-6 text-gray-300" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" /></svg>}
                            </div>
                            <div>
                              <p className="font-black text-gray-800 tracking-tight uppercase">{u.firstName} {u.lastName}</p>
                              <p className="text-[10px] font-bold text-gray-400 tracking-widest">{u.contact || 'SANS CONTACT'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6 text-center">
                          <span className={`px-4 py-1.5 rounded-full font-black text-[9px] uppercase tracking-widest ${getRoleColor(u.role)}`}>
                            {u.role.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-6 text-center">
                          <div className={`flex items-center justify-center gap-2 text-[10px] font-black ${u.isValidated ? 'text-green-500' : 'text-orange-400 animate-pulse'}`}>
                             <div className={`w-2 h-2 rounded-full ${u.isValidated ? 'bg-green-500' : 'bg-orange-400'}`}></div>
                             {u.isValidated ? 'VALIDÉ' : 'À COMPLÉTER'}
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <button className="text-gray-300 hover:text-red-500 transition-colors">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                           </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </section>
        </div>
      )}

      {activeSubTab === 'inventory' && (
        <div className="space-y-12">
          {/* Formulaire ajout boisson */}
          <section className="bg-white p-10 rounded-[3rem] shadow-premium border border-gray-50">
            <h2 className="text-2xl font-black text-gray-900 mb-8 uppercase tracking-tighter text-terracotta">Ajouter un Breuvage</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Désignation</label>
                <input type="text" className="w-full bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl font-bold" value={newBeverage.name} onChange={e => setNewBeverage({...newBeverage, name: e.target.value})} placeholder="Nom du produit..." />
              </div>
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Catégorie</label>
                <select className="w-full bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl font-bold text-xs" value={newBeverage.category} onChange={e => setNewBeverage({...newBeverage, category: e.target.value})}>
                  {['Bière', 'Jus Bouteilles', 'Jus Cassable', 'Vins', 'Wyski'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Achat Lot ({settings.currency})</label>
                <input type="number" className="w-full bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl font-bold" value={newBeverage.purchasePriceBatch} onChange={e => setNewBeverage({...newBeverage, purchasePriceBatch: Number(e.target.value)})} />
              </div>
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Unités / Lot</label>
                <input type="number" className="w-full bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl font-bold" value={newBeverage.batchSize} onChange={e => setNewBeverage({...newBeverage, batchSize: Number(e.target.value)})} />
              </div>
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Vente Unité ({settings.currency})</label>
                <input type="number" className="w-full bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl font-bold text-terracotta" value={newBeverage.price} onChange={e => setNewBeverage({...newBeverage, price: Number(e.target.value)})} />
              </div>
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Stock Initial</label>
                <input type="number" className="w-full bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl font-bold" value={newBeverage.stockQuantity} onChange={e => setNewBeverage({...newBeverage, stockQuantity: Number(e.target.value)})} />
              </div>
              <div className="flex items-end">
                <button onClick={handleAddBeverage} className="w-full bg-terracotta text-white py-3 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg hover:bg-terracotta-dark transition-all">Enregistrer</button>
              </div>
            </div>
          </section>

          {/* Liste Inventaire avec Statistiques */}
          <section className="bg-white rounded-[3rem] shadow-premium border border-gray-50 overflow-hidden">
             <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-terracotta-soft/50">
                      <th className="px-8 py-6 text-[10px] font-black text-terracotta uppercase tracking-widest">Produit</th>
                      <th className="px-6 py-6 text-[10px] font-black text-terracotta uppercase tracking-widest text-center">Stock</th>
                      <th className="px-6 py-6 text-[10px] font-black text-terracotta uppercase tracking-widest text-right">Revient</th>
                      <th className="px-6 py-6 text-[10px] font-black text-terracotta uppercase tracking-widest text-right">Vente</th>
                      <th className="px-6 py-6 text-[10px] font-black text-terracotta uppercase tracking-widest text-right">Marge</th>
                      <th className="px-8 py-6 text-[10px] font-black text-terracotta uppercase tracking-widest text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {inventory.map(item => (
                      <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-8 py-6">
                          <p className="font-black text-gray-800 tracking-tight">{item.name}</p>
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{item.category}</p>
                        </td>
                        <td className="px-6 py-6 text-center">
                          <span className={`px-3 py-1 rounded-full font-black text-xs ${item.stockQuantity <= item.minStockLevel ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                            {item.stockQuantity}
                          </span>
                        </td>
                        <td className="px-6 py-6 text-right font-bold text-gray-500">{item.costPriceUnit.toFixed(0)}</td>
                        <td className="px-6 py-6 text-right font-black text-gray-900">{item.price.toFixed(0)}</td>
                        <td className="px-6 py-6 text-right">
                          <span className="font-black text-green-600">+{(item.price - item.costPriceUnit).toFixed(0)}</span>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <button onClick={() => handleRestock(item.id, item.batchSize)} className="text-[9px] font-black uppercase text-terracotta hover:underline">Approvisionner</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default SettingsView;
