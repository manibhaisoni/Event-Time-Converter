
import React from 'react';
import { Clock, Globe as GlobeIcon } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 glass border-b-0 border-white/5 px-6 py-4 flex items-center justify-between backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
          <Clock className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-lg font-bold font-orbitron tracking-tight text-white uppercase">Event Time Converter</h1>
          <p className="text-[10px] text-cyan-400 font-bold tracking-widest uppercase">(Global)</p>
        </div>
      </div>
      
      <div className="hidden md:flex items-center gap-4 text-xs font-medium text-gray-400">
        <span className="flex items-center gap-1 text-cyan-400"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" /> Live Syncing</span>
        <span className="px-3 py-1 rounded-full border border-white/10 hover:border-white/20 transition-colors cursor-pointer">Documentation</span>
      </div>
    </header>
  );
};
