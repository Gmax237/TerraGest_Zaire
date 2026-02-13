
import React, { useState, useMemo } from 'react';
import { BarItem, Room, Transaction } from '../types';

interface BarPOSProps {
  items: BarItem[];
  rooms: Room[];
  onCompleteSale: (sale: { roomId?: number; items: Transaction[]; total: number }) => void;
}

const BarPOS: React.FC<BarPOSProps> = ({ items, rooms, onCompleteSale }) => {
  const [cart, setCart] = useState<{ item: BarItem; qty: number }[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('TOUS');

  const categories = useMemo(() => {
    const cats = Array.from(new Set(items.map(item => item.category)));
    return ['TOUS', ...cats];
  }, [items]);

  const filteredItems = useMemo(() => {
    if (activeCategory === 'TOUS') return items;
    return items.filter(item => item.category === activeCategory);
  }, [items, activeCategory]);

  const addToCart = (item: BarItem) => {
    setCart(prev => {
      const existing = prev.find(p => p.item.id === item.id);
      if (existing) {
        return prev.map(p => p.item.id === item.id ? { ...p, qty: p.qty + 1 } : p);
      }
      return [...prev, { item, qty: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(p => p.item.id !== itemId));
  };

  const total = cart.reduce((sum, p) => sum + (p.item.price * p.qty), 0);

  const handleValidation = () => {
    if (cart.length === 0) return;
    const transactions: Transaction[] = cart.map(p => ({
      itemId: p.item.id,
      itemName: p.item.name,
      price: p.item.price,
      quantity: p.qty,
      timestamp: Date.now()
    }));
    onCompleteSale({ roomId: selectedRoomId || undefined, items: transactions, total });
    setCart([]);
    setSelectedRoomId(null);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-10 h-[calc(100vh-220px)] animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Catalogue Produits */}
      <div className="flex-1 overflow-y-auto pr-2 flex flex-col">
        <div className="flex flex-col mb-8">
           <span className="text-[10px] font-black text-terracotta uppercase tracking-[0.4em] mb-2">Catalogue</span>
           <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Point de Vente</h2>
        </div>

        {/* Barre de Catégories */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                activeCategory === cat 
                  ? 'bg-terracotta text-white border-terracotta shadow-lg shadow-terracotta/20' 
                  : 'bg-white text-gray-400 border-gray-100 hover:border-terracotta/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <button
              key={item.id}
              onClick={() => addToCart(item)}
              className="bg-white p-6 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left border border-transparent hover:border-terracotta/10 group flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-[7px] font-black text-terracotta bg-terracotta-soft px-2 py-1 rounded-md uppercase tracking-widest">{item.category}</span>
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-terracotta group-hover:text-white transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                </div>
              </div>
              <h4 className="font-bold text-gray-800 text-base mb-2 group-hover:text-terracotta transition-colors leading-tight">{item.name}</h4>
              <p className="mt-auto text-xl font-black text-gray-900 tracking-tighter">{item.price.toFixed(2)}€</p>
            </button>
          ))}
        </div>
      </div>

      {/* Panier Détail */}
      <div className="w-full lg:w-[450px] bg-white rounded-[3rem] shadow-premium flex flex-col overflow-hidden border border-gray-50">
        <div className="p-8 bg-terracotta-soft/50 border-b border-gray-50 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-black text-gray-900 tracking-tight">Panier</h3>
            <p className="text-[10px] font-bold text-terracotta uppercase tracking-widest">Ticket en cours</p>
          </div>
          <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-terracotta shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          </div>
        </div>

        <div className="flex-1 p-8 overflow-y-auto space-y-6">
          {cart.length > 0 ? (
            cart.map((p) => (
              <div key={p.item.id} className="flex justify-between items-center group animate-in slide-in-from-right-4">
                <div className="flex-1">
                  <p className="font-black text-gray-800 text-sm tracking-tight">{p.item.name}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{p.qty} x {p.item.price.toFixed(2)}€</p>
                </div>
                <div className="flex items-center gap-6">
                  <span className="font-black text-gray-900">{(p.item.price * p.qty).toFixed(2)}€</span>
                  <button 
                    onClick={() => removeFromCart(p.item.id)}
                    className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 hover:bg-red-50 hover:text-red-500 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-20">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mb-6">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              </div>
              <p className="text-sm font-bold text-gray-300 uppercase tracking-widest leading-relaxed">Le panier est vide<br/>Sélectionnez un article</p>
            </div>
          )}
        </div>

        <div className="p-8 bg-gray-50/50 border-t border-gray-50 space-y-8">
          <div className="space-y-3">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">Affectation de la vente</label>
            <select
              className="w-full bg-white px-6 py-4 rounded-2xl border border-gray-100 outline-none text-xs font-black text-gray-800 shadow-sm focus:ring-2 focus:ring-terracotta/20 transition-all"
              value={selectedRoomId || ''}
              onChange={(e) => setSelectedRoomId(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">Vente Directe (Comptoir)</option>
              {rooms.map(room => (
                <option key={room.id} value={room.id}>
                  Chambre {room.number} — {room.occupantName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-between items-end px-2">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Montant Total</span>
            <span className="text-4xl font-black text-gray-900 tracking-tighter">{total.toFixed(2)}€</span>
          </div>

          <button
            disabled={cart.length === 0}
            onClick={handleValidation}
            className={`w-full py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-[0.2em] transition-all shadow-xl ${
              cart.length > 0 
                ? 'bg-terracotta text-white shadow-terracotta/20 hover:bg-terracotta-dark' 
                : 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none'
            }`}
          >
            Confirmer l'Encaissement
          </button>
        </div>
      </div>
    </div>
  );
};

export default BarPOS;
