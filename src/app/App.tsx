import { HashRouter } from 'react-router-dom'
import { AppRouter } from './router'
import { useNavigate } from 'react-router-dom'
import { P } from '@/shared/ui/ui/typography'
import { useState } from 'react'
import { Sidebar } from '@/shared/ui/sidebar/Sidebar'
import { SidebarHeader } from '@/shared/ui/sidebar/SidebarHeader'
import { SidebarContent } from '@/shared/ui/sidebar/SidebarContent'
import { SidebarGroup } from '@/shared/ui/sidebar/SidebarGroup'
import { SidebarMenu } from '@/shared/ui/sidebar/SidebarMenu'
import { SidebarMenuItem } from '@/shared/ui/sidebar/SidebarMenuItem'
import { SidebarMenuButton } from '@/shared/ui/sidebar/SidebarMenuButton'
import { SidebarRail } from '@/shared/ui/sidebar/SidebarRail'
import { SiteHeader } from './SiteHeader'
import { Z_INDEX } from '@/lib/constants'
import { Home } from 'lucide-react'

const navSections = [
  {
    label: 'Character Creation',
    items: [
      { to: '/race', label: 'Races' },
      { to: '/birth-signs', label: 'Birth Signs' },
      { to: '/traits', label: 'Traits' },
      { to: '/skills', label: 'Skill Selection' },
      { to: '/religions', label: 'Religion' },
    ],
  },
  {
    label: 'Progression',
    items: [
      { to: '/destiny', label: 'Destiny ' },
      { to: '/perks', label: 'Perks' },
    ],
  },
  {
    label: 'Gear',
    items: [
      { to: '/weapons', label: 'Weapons' },
      { to: '/armor', label: 'Armor' },
      { to: '/food', label: 'Food' },
      { to: '/alcohol', label: 'Alcohol' },
    ],
  },
  {
    label: 'Crafting',
    items: [
      { to: '/alchemy', label: 'Alchemy' },
      { to: '/smithing', label: 'Smithing' },
      { to: '/enchanting', label: 'Enchanting' },
    ],
  },
  {
    label: 'Ascensions',
    items: [
      { to: "/shouts", label: "Shouts of the Dragonborn" },
      { to: '/lichdom', label: 'Lichdom' },
      { to: '/lycanthropy', label: 'Lycanthropy' },
      { to: '/vampirism', label: 'Vampirism' },
    ],
  },
]

function AppSidebar({ collapsed }: { collapsed: boolean }) {
  const navigate = useNavigate()
  const currentPath = window.location.hash.replace(/^#\/?/, '/')

  return (
    <Sidebar collapsed={collapsed}>
      <SidebarHeader>
        {!collapsed && (
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center w-full gap-2 hover:bg-skyrim-gold/15 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] rounded px-2 py-1 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-skyrim-gold/50 focus:ring-offset-1"
          >
            <Home className="w-4 h-4 text-skyrim-gold transition-transform duration-200 group-hover:scale-110" />
            <span className="text-sm font-semibold text-skyrim-gold tracking-wide">Home</span>
          </button>
        )}
      </SidebarHeader>
      <SidebarContent>
        {navSections.map((section) => (
          <SidebarGroup key={section.label}>
            {!collapsed && (
              <div className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-skyrim-gold/60">
                {section.label}
              </div>
            )}
            <SidebarMenu>
              {section.items.map((item) => {
                const isActive = currentPath === item.to
                return (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      onClick={() => navigate(item.to)}
                      tabIndex={0}
                    >
                      <span className="w-full text-left truncate">
                        {item.label}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      {!collapsed && (
        <div className="mt-auto px-3 py-2 border-t border-skyrim-gold/20 text-center">
          <P className="text-xs text-skyrim-gold/50">Version 1.0.0</P>
          <button
            className="mt-2 text-skyrim-gold/70 hover:text-skyrim-gold hover:bg-skyrim-gold/10 text-xs rounded px-2 py-1"
            tabIndex={0}
          >
            ⚙️ Settings
          </button>
        </div>
      )}
      <SidebarRail />
    </Sidebar>
  )
}

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  return (
    <HashRouter>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <SiteHeader
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed((c) => !c)}
        />
        <div className="flex flex-1 relative">
          <div 
            className={`absolute top-0 left-0 h-full transition-transform duration-300 ease-in-out ${
              sidebarCollapsed ? '-translate-x-full' : 'translate-x-0'
            }`}
            style={{ zIndex: Z_INDEX.SIDEBAR }}
          >
            <AppSidebar collapsed={false} />
          </div>
          <main className={`flex-1 p-8 transition-all duration-300 ease-in-out ${
            sidebarCollapsed ? 'ml-0' : 'ml-64'
          }`}>
            <AppRouter />
          </main>
        </div>
      </div>
    </HashRouter>
  )
}

export default App
