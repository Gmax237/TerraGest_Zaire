
import React from 'react';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  size?: 'md' | 'lg';
}

const Modal: React.FC<ModalProps> = ({ title, onClose, children, size = 'md' }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-terracotta-dark/10 backdrop-blur-md no-print animate-in fade-in duration-300">
      <div className={`${size === 'lg' ? 'max-w-4xl' : 'max-w-xl'} w-full bg-white rounded-[3rem] shadow-premium overflow-hidden flex flex-col animate-in zoom-in-95 duration-500`}>
        <div className="px-10 py-8 border-b border-gray-50 flex justify-between items-center bg-white/50">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-terracotta uppercase tracking-[0.3em] mb-1">Configuration</span>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">{title}</h3>
          </div>
          <button onClick={onClose} className="p-3 bg-gray-50 hover:bg-terracotta-soft rounded-2xl text-gray-400 hover:text-terracotta transition-all active:scale-95">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-10 overflow-y-auto max-h-[80vh] scroll-smooth">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
