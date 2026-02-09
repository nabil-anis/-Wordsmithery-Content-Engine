
import React, { useState, useRef, useEffect } from 'react';

interface SearchableSelectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({ options, value, onChange, placeholder = "Search..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(opt =>
    opt.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white/5 border rounded-2xl px-6 py-4 flex items-center justify-between cursor-pointer transition-all duration-300 group ${isOpen ? 'border-purple-500/50 ring-1 ring-purple-500/20' : 'border-white/10 hover:border-white/20'
          }`}
      >
        <span className={`text-sm font-medium tracking-wide transition-colors ${value ? "text-white" : "text-white/30"}`}>
          {value || placeholder}
        </span>
        <svg
          className={`w-5 h-5 text-white/30 transition-transform duration-500 ${isOpen ? 'rotate-180 text-purple-400' : 'group-hover:text-white/50'}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 z-[100] mt-2 bg-[#0a0510] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="p-3 border-b border-white/5 bg-white/[0.02]">
            <div className="relative">
              <input
                type="text"
                autoFocus
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 transition-all"
                placeholder="Filter promotions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-20">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
              </div>
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto custom-scrollbar bg-black/40">
            {search.trim() && !options.some(opt => opt.toLowerCase() === search.toLowerCase()) && (
              <div
                className="px-6 py-3 text-sm font-medium text-purple-400 hover:bg-purple-500/10 transition-all cursor-pointer flex items-center justify-between border-b border-white/5"
                onClick={() => {
                  onChange(search.trim());
                  setIsOpen(false);
                  setSearch("");
                }}
              >
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7v14" /></svg>
                  <span>Use custom: "{search.trim()}"</span>
                </div>
              </div>
            )}
            {filteredOptions.length > 0 ? (
              <div className="py-2">
                {filteredOptions.map((opt) => (
                  <div
                    key={opt}
                    className={`px-6 py-3 text-sm font-medium transition-all cursor-pointer flex items-center justify-between group/item ${value === opt
                        ? 'bg-purple-600/20 text-white'
                        : 'text-white/50 hover:bg-white/5 hover:text-white'
                      }`}
                    onClick={() => {
                      onChange(opt);
                      setIsOpen(false);
                      setSearch("");
                    }}
                  >
                    <span className="tracking-wide">{opt}</span>
                    {value === opt && (
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_#A855F7]" />
                    )}
                  </div>
                ))}
              </div>
            ) : !search.trim() && (
              <div className="px-6 py-8 text-center">
                <p className="text-xs text-white/20 uppercase tracking-[0.2em] font-black italic">No matches found</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
