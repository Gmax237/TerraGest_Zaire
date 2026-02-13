
import React, { useState } from 'react';
import { HistoryEvent } from '../types';

interface HistoryViewProps {
  history: HistoryEvent[];
}

const HistoryView: React.FC<HistoryViewProps> = ({ history }) => {
  const [filter, setFilter] = useState('');

  const filteredHistory = history.filter(event => 
    event.description.toLowerCase().includes(filter.toLowerCase()) ||
    event.type.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-4">
        <div>
          <span className="text-[10px] font-black text-terracotta uppercase tracking-[0.4em] mb-2 block">Traçabilité</span>
          <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Journal d'Audit</h2>
          <p className="text-sm text-gray-400 mt-2 font-medium italic">Sécurité des données et immuabilité des registres.</p>
        </div>
        <div className="relative group w-full md:w-96">
          <input 
            type="text" 
            placeholder="Rechercher un événement..."
            className="w-full pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-terracotta/5 shadow-sm group-hover:shadow-md transition-all font-bold text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <svg className="w-5 h-5 absolute left-4 top-4.5 text-terracotta" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] overflow-hidden shadow-premium border border-gray-50">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-terracotta-soft/30 border-b border-gray-50">
                <th className="px-10 py-6 text-[10px] font-black text-terracotta uppercase tracking-widest">Horodatage</th>
                <th className="px-8 py-6 text-[10px] font-black text-terracotta uppercase tracking-widest">Opération</th>
                <th className="px-8 py-6 text-[10px] font-black text-terracotta uppercase tracking-widest">Description</th>
                <th className="px-8 py-6 text-[10px] font-black text-terracotta uppercase tracking-widest text-right">Flux</th>
                <th className="px-10 py-6 text-[10px] font-black text-terracotta uppercase tracking-widest text-right">Registre</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((event) => (
                  <tr key={event.id} className="hover:bg-terracotta-soft/10 transition-colors group">
                    <td className="px-10 py-6 text-xs text-gray-400 font-bold whitespace-nowrap">
                      {new Date(event.timestamp).toLocaleString('fr-FR')}
                    </td>
                    <td className="px-8 py-6">
                      <span className={`text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider border ${
                        event.type === 'SECURITY_ALERT' ? 'bg-red-500 text-white border-red-600 animate-pulse' :
                        event.type.includes('CHECK') ? 'bg-terracotta text-white border-terracotta shadow-sm' :
                        event.type.includes('BAR') ? 'bg-indigo-600 text-white border-indigo-700' :
                        'bg-gray-100 text-gray-500 border-gray-200'
                      }`}>
                        {event.type}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-sm font-bold text-gray-800 tracking-tight">
                      {event.description}
                    </td>
                    <td className="px-8 py-6 text-sm font-black text-gray-900 text-right">
                      {event.amount ? `${event.amount.toFixed(2)}€` : '—'}
                    </td>
                    <td className="px-10 py-6 text-[9px] font-mono text-terracotta/40 text-right group-hover:text-terracotta transition-colors">
                      {event.checksum ? `HASH:${event.checksum.slice(0, 16)}` : 'SANS SIGNATURE'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-10 py-24 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mx-auto mb-4">
                       <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3" /></svg>
                    </div>
                    <p className="text-sm font-bold text-gray-300 uppercase tracking-widest">Aucune donnée historique</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 21.355r2.263-1.091c4.27-2.056 6.74-6.996 5.735-11.594L12 2.944 4.002 8.67c-1.005 4.598 1.465 9.538 5.735 11.594L12 21.355z', title: 'Registre Chiffré', status: 'Actif', color: 'text-green-500 bg-green-50' },
          { icon: 'M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 20c4.083 0 7.662-2.433 9.27-6M12 11V3m0 8c0-3.517 1.009-6.799 2.753-9.571M6.74 4.64l.054.09A10.003 10.003 0 0112 2c4.083 0 7.662 2.433 9.27 6', title: 'Preuves AES-256', status: 'Certifié', color: 'text-terracotta bg-terracotta-soft' },
          { icon: 'M13 10V3L4 14h7v7l9-11h-7z', title: 'Performance Sync', status: 'Optimisée', color: 'text-indigo-600 bg-indigo-50' }
        ].map((badge, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 flex items-center gap-6 shadow-sm">
            <div className={`w-14 h-14 ${badge.color} rounded-2xl flex items-center justify-center shadow-inner`}>
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={badge.icon} /></svg>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{badge.title}</p>
              <p className="text-lg font-black text-gray-800 tracking-tight">{badge.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryView;
