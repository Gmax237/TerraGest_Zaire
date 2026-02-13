
import React, { useMemo } from 'react';
import { BarItem, HistoryEvent, GlobalSettings } from '../types';

interface FinanceViewProps {
  inventory: BarItem[];
  history: HistoryEvent[];
  settings: GlobalSettings;
}

const FinanceView: React.FC<FinanceViewProps> = ({ inventory, history, settings }) => {
  const today = new Date().setHours(0, 0, 0, 0);

  const stats = useMemo(() => {
    const todaySales = history.filter(h => h.type === 'BAR_SALE' && h.timestamp >= today);
    const turnover = todaySales.reduce((sum, h) => sum + (h.amount || 0), 0);
    
    // Estimation bénéfice (basée sur marge actuelle de l'inventaire)
    // Pour un rapport plus précis, il faudrait stocker le costPrice dans chaque événement HistoryEvent
    const estimatedProfit = todaySales.reduce((sum, h) => {
       return sum + ((h.amount || 0) * 0.4); // Simulation: 40% de marge moyenne si non précisé
    }, 0);

    const stockValue = inventory.reduce((sum, item) => sum + (item.stockQuantity * item.costPriceUnit), 0);
    const potentialRevenue = inventory.reduce((sum, item) => sum + (item.stockQuantity * item.price), 0);

    return { turnover, estimatedProfit, stockValue, potentialRevenue, salesCount: todaySales.length };
  }, [history, inventory, today]);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <div className="flex flex-col">
          <span className="text-[10px] font-black text-terracotta uppercase tracking-[0.4em] mb-2">Rapports</span>
          <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">État Journalier</h2>
          <p className="text-sm text-gray-400 mt-2 font-medium italic">Analyse des flux financiers et de la valeur des actifs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Chiffre d\'Affaires (J)', value: stats.turnover, color: 'bg-terracotta text-white', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
          { label: 'Bénéfice Estimé', value: stats.estimatedProfit, color: 'bg-white text-green-600 border-green-100', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
          { label: 'Valeur du Stock (Prix Revient)', value: stats.stockValue, color: 'bg-white text-gray-900 border-gray-100', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
          { label: 'Recettes Potentielles', value: stats.potentialRevenue, color: 'bg-indigo-50 text-indigo-700 border-indigo-100', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
        ].map((card, i) => (
          <div key={i} className={`p-8 rounded-[2.5rem] shadow-sm flex flex-col gap-4 border ${card.color}`}>
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white/20 border border-white/30">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={card.icon} /></svg>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{card.label}</p>
              <p className="text-2xl font-black tracking-tighter">{card.value.toLocaleString()} {settings.currency}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
         {/* Alerte Stocks Critiques */}
         <div className="bg-white p-10 rounded-[3rem] shadow-premium border border-gray-50">
            <h3 className="text-xl font-black text-gray-900 mb-8 uppercase tracking-tight flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              Alertes Réapprovisionnement
            </h3>
            <div className="space-y-4">
               {inventory.filter(i => i.stockQuantity <= i.minStockLevel).length > 0 ? (
                 inventory.filter(i => i.stockQuantity <= i.minStockLevel).map(item => (
                    <div key={item.id} className="flex justify-between items-center p-5 bg-red-50/50 rounded-2xl border border-red-100">
                       <div>
                         <p className="font-black text-gray-800 text-sm tracking-tight">{item.name}</p>
                         <p className="text-[9px] font-bold text-red-400 uppercase tracking-widest">Seuil: {item.minStockLevel} | Actuel: {item.stockQuantity}</p>
                       </div>
                       <div className="text-right">
                          <p className="text-xs font-black text-gray-900">{item.stockQuantity} un.</p>
                       </div>
                    </div>
                 ))
               ) : (
                 <div className="py-12 text-center">
                    <p className="text-xs font-black text-gray-300 uppercase tracking-[0.2em]">Tous les stocks sont optimaux</p>
                 </div>
               )}
            </div>
         </div>

         {/* Dernières Ventes Bar */}
         <div className="bg-white p-10 rounded-[3rem] shadow-premium border border-gray-50">
            <h3 className="text-xl font-black text-gray-900 mb-8 uppercase tracking-tight">Ventes Récentes</h3>
            <div className="space-y-6">
               {history.filter(h => h.type === 'BAR_SALE').slice(0, 5).map(event => (
                 <div key={event.id} className="flex justify-between items-center group">
                    <div className="flex gap-4 items-center">
                       <div className="w-10 h-10 rounded-full bg-terracotta-soft flex items-center justify-center text-terracotta font-black text-xs">
                         {new Date(event.timestamp).getHours()}h
                       </div>
                       <div>
                         <p className="font-black text-gray-800 text-sm tracking-tight">{event.description}</p>
                         <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{event.user}</p>
                       </div>
                    </div>
                    <span className="font-black text-gray-900">{(event.amount || 0).toLocaleString()} {settings.currency}</span>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default FinanceView;
