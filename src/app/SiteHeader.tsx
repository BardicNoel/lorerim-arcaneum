import React from 'react'
import { Menu } from 'lucide-react'
import { Z_INDEX } from '@/lib/constants'
import { ThemeToggle } from '@/shared/ui/ThemeToggle'

interface SiteHeaderProps {
  sidebarCollapsed: boolean
  onToggleSidebar: () => void
}

export function SiteHeader({
  sidebarCollapsed,
  onToggleSidebar,
}: SiteHeaderProps) {
  return (
    <header
      className="sticky top-0 w-full h-12 flex items-center bg-background border-b border-skyrim-gold/20 px-2 shadow-sm"
      style={{ zIndex: Z_INDEX.NAVIGATION }}
    >
      <button
        onClick={onToggleSidebar}
        aria-label={sidebarCollapsed ? 'Open sidebar' : 'Close sidebar'}
        className="flex items-center justify-center w-10 h-10 rounded transition-all duration-200 ease-in-out hover:bg-skyrim-gold/15 hover:shadow-md hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-skyrim-gold/50 focus:ring-offset-1 mr-2"
      >
        <Menu className="w-5 h-5 text-skyrim-gold transition-transform duration-200 group-hover:rotate-12" />
      </button>
      <span className="text-skyrim-gold font-bold text-base tracking-tight select-none">
        Lorerim Arcaneum
      </span>
      <span className="ml-2 text-xs text-skyrim-gold/60 select-none">
        Theorycrafting Hub
      </span>

      {/* Theme Toggle */}
      <div className="ml-auto">
        <ThemeToggle />
      </div>
    </header>
  )
}
