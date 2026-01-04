
import React from 'react';

export const Globe: React.FC = () => {
  return (
    <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center perspective-[1000px] pointer-events-none">
      {/* Glow */}
      <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-[60px]" />
      
      {/* Outer Sphere */}
      <div className="relative w-full h-full rounded-full border border-cyan-500/20 glass overflow-hidden animate-globe">
        {/* Simple grid lines for 3D feel */}
        <div className="absolute inset-0 flex flex-col justify-around">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-full h-px bg-cyan-500/10" />
          ))}
        </div>
        <div className="absolute inset-0 flex justify-around">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-px h-full bg-cyan-500/10" />
          ))}
        </div>
        
        {/* Continent-like shapes */}
        <div className="absolute top-1/4 left-1/4 w-12 h-8 bg-cyan-400/20 rounded-full blur-sm" />
        <div className="absolute top-1/2 left-1/2 w-16 h-12 bg-purple-500/20 rounded-full blur-sm" />
        <div className="absolute bottom-1/4 right-1/4 w-10 h-10 bg-blue-500/20 rounded-full blur-sm" />
      </div>

      {/* Axis Ring */}
      <div className="absolute w-[110%] h-[110%] border border-white/5 rounded-full rotate-x-[60deg]" />
    </div>
  );
};
