
import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen relative flex flex-col">
      <div className="cosmic-bg" />
      <div className="nebula-1" />
      <div className="nebula-2" />
      <div className="star-field" />
      
      <main className="flex-1 container mx-auto px-4 py-8 relative z-10">
        {children}
      </main>
      
      <footer className="py-6 text-center text-xs text-white/30 tracking-widest uppercase">
        Wordsmithery Content Engine &copy; 2026 • Cosmic Creativity
      </footer>
    </div>
  );
};
