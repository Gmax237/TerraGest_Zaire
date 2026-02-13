
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface ProfileViewProps {
  user: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onUpdateProfile }) => {
  const [formData, setFormData] = useState<UserProfile>(user);
  const [saving, setSaving] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'photoUrl' | 'cniScanUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setSaving(true);
    // Un profil est valide s'il a au moins un nom, prénom, contact, photo et CNI
    const isValidated = !!(formData.firstName && formData.lastName && formData.contact && formData.photoUrl && formData.cniScanUrl);
    
    setTimeout(() => {
      onUpdateProfile({ ...formData, isValidated });
      setSaving(false);
      alert(isValidated ? "Profil mis à jour et validé !" : "Profil mis à jour. Attention : des pièces manquent pour la validation complète.");
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl">
        <div className="flex justify-between items-start mb-10">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Validation du Personnel</h2>
            <p className="text-gray-500 mt-2 font-medium italic">Complétez vos informations pour obtenir vos accès opérationnels.</p>
          </div>
          <div className={`px-4 py-2 rounded-2xl border font-black text-xs uppercase tracking-widest ${
            formData.isValidated ? 'bg-green-50 text-green-600 border-green-100' : 'bg-orange-50 text-orange-600 border-orange-100'
          }`}>
            Statut: {formData.isValidated ? 'Compte Validé' : 'Vérification en cours'}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Section Informations */}
          <div className="space-y-6">
            <p className="text-[10px] font-black text-terracotta uppercase tracking-[0.2em] mb-4 border-b border-terracotta-light pb-2">Identité & Contact</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Prénom</label>
                <input 
                  type="text" 
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-terracotta/20 font-bold"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Nom</label>
                <input 
                  type="text" 
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-terracotta/20 font-bold"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Numéro de Contact (WhatsApp préféré)</label>
              <input 
                type="text" 
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-terracotta/20 font-bold"
                value={formData.contact}
                onChange={(e) => setFormData({...formData, contact: e.target.value})}
              />
            </div>

            <div className="pt-8">
              <button 
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3"
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    Enregistrer les modifications
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Section Documents */}
          <div className="space-y-8">
             <p className="text-[10px] font-black text-terracotta uppercase tracking-[0.2em] mb-4 border-b border-terracotta-light pb-2">Pièces Justificatives</p>
             
             {/* Photo Profil */}
             <div className="flex items-center gap-6">
               <div className="w-32 h-32 rounded-3xl bg-gray-100 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {formData.photoUrl ? (
                    <img src={formData.photoUrl} alt="Aperçu" className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  )}
               </div>
               <div className="flex-1">
                 <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Photo de Profil (Format JPG/PNG)</label>
                 <input 
                   type="file" 
                   accept="image/*"
                   onChange={(e) => handleFileChange(e, 'photoUrl')}
                   className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-terracotta-light file:text-terracotta hover:file:bg-terracotta hover:file:text-white transition-all" 
                 />
               </div>
             </div>

             {/* Scan CNI */}
             <div className="space-y-4">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Scan de la CNI / Passeport (Obligatoire)</label>
                <div className={`relative h-48 rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center bg-gray-50 hover:bg-white ${
                  formData.cniScanUrl ? 'border-green-300' : 'border-gray-200'
                }`}>
                  {formData.cniScanUrl ? (
                    <div className="absolute inset-0 p-2">
                       <img src={formData.cniScanUrl} alt="CNI" className="w-full h-full object-contain rounded-2xl" />
                       <button 
                        onClick={() => setFormData({...formData, cniScanUrl: undefined})}
                        className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-lg"
                       >
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                       </button>
                    </div>
                  ) : (
                    <>
                      <svg className="w-12 h-12 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" /></svg>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'cniScanUrl')}
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                      />
                      <span className="text-xs font-bold text-gray-400">Cliquez pour téléverser votre pièce d'identité</span>
                    </>
                  )}
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="bg-terracotta-light p-8 rounded-[2rem] border border-terracotta/10 flex items-start gap-6">
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-terracotta shadow-sm flex-shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <div>
          <p className="text-sm font-black text-terracotta uppercase tracking-widest mb-2">Note de sécurité</p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Vos données sont chiffrées localement et ne sont accessibles qu'aux administrateurs certifiés pour le journal d'audit obligatoire. La validation de votre profil est nécessaire pour que votre nom apparaisse correctement dans l'historique des opérations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
