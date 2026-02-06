
import React from 'react';

interface ToneSelectorProps {
  options: { id: string; name: string }[];
  selected: string;
  onSelect: (id: string) => void;
}

export const ToneSelector: React.FC<ToneSelectorProps> = ({ options, selected, onSelect }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-white/60 uppercase tracking-widest">Tone of Voice</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((tone) => (
          <button
            key={tone.id}
            onClick={() => onSelect(tone.id)}
            className={`p-6 rounded-2xl text-left transition-all duration-300 border relative overflow-hidden group outline-none ${
              selected === tone.id
                ? 'bg-purple-600/10 border-purple-500/50 shadow-[0_0_30px_rgba(143,68,173,0.15)]'
                : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]'
            }`}
          >
            {/* Isolated selection glow layer to prevent rendering glitches */}
            <div 
              className={`absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[40px] -translate-y-1/2 translate-x-1/2 pointer-events-none transition-opacity duration-500 ${
                selected === tone.id ? 'opacity-100' : 'opacity-0'
              }`} 
            />
            
            <div className="flex items-center justify-between mb-3 relative z-10">
              <span className={`text-xl font-bold transition-colors duration-300 ${selected === tone.id ? 'text-white' : 'text-white/40 group-hover:text-white/60'}`}>
                {tone.name}
              </span>
              <div className={`transition-all duration-300 transform ${selected === tone.id ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
                <div className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-[0_0_10px_#A855F7]" />
              </div>
            </div>
            
            <p className={`text-xs transition-colors duration-300 ${selected === tone.id ? 'text-white/60' : 'text-white/20'}`}>
              Draft content using the {tone.name} narrative identity.
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};
