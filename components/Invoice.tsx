
import React from 'react';
import { Room } from '../types';

interface InvoiceProps {
  room: Room;
  onPaid: () => void;
}

const Invoice: React.FC<InvoiceProps> = ({ room, onPaid }) => {
  const barTotal = room.barBill.reduce((sum, tx) => sum + (tx.price * tx.quantity), 0);
  const total = barTotal; 

  return (
    <div className="bg-white animate-in zoom-in-95 duration-500">
      <div className="border border-terracotta/10 p-12 rounded-[3rem] bg-white shadow-premium font-sans text-sm mb-10" id="printable-invoice">
        <div className="flex justify-between items-start border-b-2 border-terracotta pb-10 mb-12">
          <div className="flex flex-col gap-4">
            <div className="w-16 h-16 bg-terracotta rounded-2xl flex items-center justify-center text-white shadow-xl">
               <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" /></svg>
            </div>
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase mb-1">TerraGest Épure</h2>
              <p className="text-[10px] font-black text-terracotta uppercase tracking-[0.3em]">Hôtellerie de Luxe & Services</p>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full mb-4">Document Officiel</span>
            <h3 className="font-black text-gray-900 text-2xl tracking-tight">FACTURE N°{Date.now().toString().slice(-6)}</h3>
            <p className="text-terracotta font-bold mt-1 uppercase tracking-widest text-[10px]">{new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-16 mb-16">
          <div className="bg-terracotta-soft/30 p-8 rounded-[2rem]">
            <h4 className="font-black text-terracotta uppercase text-[9px] tracking-[0.3em] mb-4">Détails de l'Hébergement</h4>
            <p className="text-2xl font-black text-gray-900 tracking-tight">{room.occupantName}</p>
            <p className="text-sm font-bold text-gray-500 mt-2">Unité № {room.number} — {room.name}</p>
            <div className="flex items-center gap-2 mt-4">
               <span className="text-[9px] font-black bg-white px-2 py-0.5 rounded text-terracotta border border-terracotta/10 uppercase tracking-widest">{room.occupationType}</span>
            </div>
          </div>
          <div className="text-right p-8 flex flex-col justify-center">
            <h4 className="font-black text-gray-400 uppercase text-[9px] tracking-[0.3em] mb-4">Période du Séjour</h4>
            <p className="text-sm font-bold text-gray-800">Arrivée : {new Date(room.checkInDate || 0).toLocaleDateString()}</p>
            <p className="text-sm font-bold text-gray-800">Départ : {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <table className="w-full mb-16">
          <thead className="border-b border-gray-100">
            <tr>
              <th className="text-left py-4 font-black text-gray-400 uppercase text-[9px] tracking-widest">Désignation des Prestations</th>
              <th className="text-center py-4 font-black text-gray-400 uppercase text-[9px] tracking-widest">Qté</th>
              <th className="text-right py-4 font-black text-gray-400 uppercase text-[9px] tracking-widest">P.U TTC</th>
              <th className="text-right py-4 font-black text-gray-400 uppercase text-[9px] tracking-widest">Total TTC</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            <tr className="group">
              <td className="py-6 font-black text-gray-800">Forfait Séjour — {room.name}</td>
              <td className="text-center py-6 font-bold text-gray-400">1</td>
              <td className="text-right py-6 font-bold text-gray-400">0.00€</td>
              <td className="text-right py-6 font-black text-gray-900">0.00€</td>
            </tr>
            {room.barBill.map((tx, idx) => (
              <tr key={idx} className="group">
                <td className="py-6 text-gray-600 font-medium">Service Bar : {tx.itemName}</td>
                <td className="text-center py-6 font-bold text-gray-400">{tx.qty}</td>
                <td className="text-right py-6 font-bold text-gray-400">{tx.price.toFixed(2)}€</td>
                <td className="text-right py-6 font-black text-gray-900">{(tx.price * tx.qty).toFixed(2)}€</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex flex-col items-end gap-3 border-t-2 border-gray-50 pt-10">
          <div className="flex justify-between w-64 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <span>Montant HT</span>
            <span>{(total * 0.8).toFixed(2)}€</span>
          </div>
          <div className="flex justify-between w-64 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <span>TVA Collectée (20%)</span>
            <span>{(total * 0.2).toFixed(2)}€</span>
          </div>
          <div className="flex justify-between w-72 pt-6 border-t border-gray-50 mt-4">
            <span className="text-xs font-black text-terracotta uppercase tracking-[0.3em]">Net à Payer</span>
            <span className="text-4xl font-black text-gray-900 tracking-tighter">{total.toFixed(2)}€</span>
          </div>
        </div>

        <div className="mt-20 text-center text-[10px] font-black text-gray-300 border-t border-gray-50 pt-10 tracking-[0.4em] uppercase">
          Merci de votre confiance — TerraGest Épure
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-6 no-print">
        <button 
          className="px-8 py-4 text-[10px] font-black text-terracotta uppercase tracking-widest hover:text-terracotta-dark transition-all flex items-center gap-3"
          onClick={() => window.print()}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          Aperçu Impression
        </button>
        <button 
          onClick={onPaid}
          className="w-full md:w-auto bg-gray-900 text-white px-16 py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-4"
        >
          <svg className="w-5 h-5 text-terracotta" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
          Clôturer & Encaisser
        </button>
      </div>
    </div>
  );
};

export default Invoice;
