import React from 'react';

interface SiteHeaderProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export function SiteHeader({ sidebarCollapsed, onToggleSidebar }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full h-12 flex items-center bg-skyrim-dark border-b border-skyrim-gold/20 px-2 shadow-sm">
      <button
        onClick={onToggleSidebar}
        aria-label={sidebarCollapsed ? 'Open sidebar' : 'Close sidebar'}
        className="flex items-center justify-center w-10 h-10 rounded hover:bg-skyrim-gold/10 focus:outline-none mr-2"
      >
        <img src="/arcaneum-scroll.png" alt="Lorerim Arcaneum Logo" className="w-6 h-6" />
      </button>
      <span className="text-skyrim-gold font-bold text-base tracking-tight select-none">Lorerim Arcaneum</span>
      <span className="ml-2 text-xs text-skyrim-gold/60 select-none">Theorycrafting Hub</span>
      {/* Optionally add version or user info here */}
    </header>
  );
} 