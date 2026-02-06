
import React from 'react';

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: {
    region: string;
    tone: string;
    promotion: string;
    content: string;
  } | null;
  onCopy: (content: string) => void;
  copyFeedback: boolean;
}

export const ResultModal: React.FC<ResultModalProps> = ({ isOpen, onClose, result, onCopy, copyFeedback }) => {
  if (!isOpen || !result) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative glass-card w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300">
        <header className="p-8 border-b border-white/5 flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-white">{result.region}</h3>
            <div className="flex gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">{result.tone}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/20">•</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">{result.promotion}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onCopy(result.content)}
              className="px-6 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-purple-900/40"
            >
              {copyFeedback ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
              )}
              {copyFeedback ? 'Copied' : 'Copy Content'}
            </button>
            <button 
              onClick={onClose}
              className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all border border-white/5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          <div className="prose prose-invert max-w-none prose-p:text-white/80 prose-headings:text-white prose-p:text-xl prose-p:leading-relaxed font-light tracking-wide whitespace-pre-wrap">
            {result.content}
          </div>
        </div>

        <footer className="p-6 bg-white/5 border-t border-white/5 flex justify-between text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold">
          <span>Wordsmithery Intelligence</span>
          <span>Regional Specialized Draft</span>
        </footer>
      </div>
    </div>
  );
};
