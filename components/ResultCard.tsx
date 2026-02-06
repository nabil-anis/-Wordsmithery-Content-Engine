
import React from 'react';

interface ResultCardProps {
  region: string;
  tone: string;
  promotion: string;
  content: string;
  onClick: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ region, tone, promotion, content, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="glass-card rounded-[1.5rem] p-6 border border-white/10 hover:border-purple-500/40 transition-all cursor-pointer group hover:shadow-[0_15px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(143,68,173,0.1)] flex flex-col h-full relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 blur-[40px] -translate-y-1/2 translate-x-1/2 group-hover:bg-purple-500/10 transition-colors" />
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <h4 className="text-xl font-extrabold text-white group-hover:text-purple-300 transition-colors tracking-tight">{region}</h4>
        <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-white/40 group-hover:bg-purple-500/20 group-hover:text-purple-300 transition-all border border-white/5">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-6 relative z-10">
        <span className="px-2.5 py-1 rounded-md bg-purple-500/20 text-purple-300 text-[8px] font-black uppercase tracking-[0.1em] border border-purple-500/20">
          {tone}
        </span>
        <span className="px-2.5 py-1 rounded-md bg-white/5 text-white/40 text-[8px] font-black uppercase tracking-[0.1em] border border-white/5">
          {promotion}
        </span>
      </div>

      <p className="text-white/60 text-sm line-clamp-4 leading-relaxed flex-grow font-light tracking-wide relative z-10 italic">
        "{content}"
      </p>
      
      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[9px] text-white/20 uppercase tracking-[0.15em] font-bold relative z-10">
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
          Full Review
        </span>
        <span className="opacity-0 group-hover:opacity-100 transition-opacity">Read Draft</span>
      </div>
    </div>
  );
};
