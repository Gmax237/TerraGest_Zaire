
import React from 'react';
import { UserProfile, UserRole } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  currentUser: UserProfile;
  onSwitchUser: (user: UserProfile) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, currentUser, onSwitchUser }) => {
  const tabs = [
    { id: 'dashboard', label: 'Temps Réel', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2', role: [UserRole.SUPER_ADMIN, UserRole.GERANT, UserRole.PERSONNEL] },
    { id: 'calendar', label: 'Planning', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', role: [UserRole.SUPER_ADMIN, UserRole.GERANT, UserRole.PERSONNEL] },
    { id: 'pos', label: 'Bar', icon: 'M9 7L5 21m3-11l13-3m-4.5 9L21 21', role: [UserRole.SUPER_ADMIN, UserRole.GERANT, UserRole.PERSONNEL] },
    { id: 'finance', label: 'Finances', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', role: [UserRole.SUPER_ADMIN, UserRole.GERANT] },
    { id: 'history', label: 'Journal', icon: 'M12 8v4l3 3', role: [UserRole.SUPER_ADMIN, UserRole.GERANT, UserRole.PERSONNEL] },
    { id: 'settings', label: 'Configuration', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0', role: [UserRole.SUPER_ADMIN, UserRole.GERANT] },
  ];

  return (
    <aside className="w-72 bg-white border-r border-gray-100 flex flex-col no-print h-screen sticky top-0 overflow-hidden">
      <div className="p-10 flex flex-col h-full">
        <div className="flex items-center gap-4 mb-16">
          <div className="w-12 h-12 bg-terracotta rounded-[1.25rem] flex items-center justify-center text-white shadow-premium">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" /></svg>
          </div>
          <div className="flex flex-col">
             <span className="font-black text-xl text-gray-900 tracking-tighter">TerraGest</span>
             <span className="text-[8px] font-black uppercase tracking-[0.3em] text-terracotta/40">Premium Management</span>
          </div>
        </div>

        <nav className="space-y-2 flex-1">
          {tabs.filter(tab => tab.role.includes(currentUser.role)).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] transition-all duration-300 ${
                activeTab === tab.id 
                  ? 'bg-terracotta text-white shadow-premium' 
                  : 'text-gray-400 hover:bg-terracotta-soft hover:text-terracotta'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon} /></svg>
              <span className="font-bold text-xs uppercase tracking-widest">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-10 border-t border-gray-50">
           <div className="bg-terracotta-soft p-6 rounded-[2rem] relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-[10px] font-black text-terracotta uppercase tracking-widest mb-1">{currentUser.firstName}</p>
                <p className="text-[8px] font-bold text-gray-400 uppercase mb-4">{currentUser.role.replace('_', ' ')}</p>
                <button 
                  onClick={() => setActiveTab('profile')}
                  className="w-full bg-white py-3 rounded-xl text-[9px] font-black uppercase tracking-widest text-terracotta shadow-sm hover:shadow-md transition-all"
                >
                  Profil & Sécurité
                </button>
              </div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-terracotta/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
           </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
