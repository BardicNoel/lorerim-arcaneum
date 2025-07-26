import { Z_INDEX } from '@/lib/constants'
import { FloatingBuildButton } from '@/shared/components/FloatingBuildButton'
import { useURLSync } from '@/shared/hooks/useURLSync'
import { Sidebar } from '@/shared/ui/sidebar/Sidebar'
import { SidebarContent } from '@/shared/ui/sidebar/SidebarContent'
import { SidebarGroup } from '@/shared/ui/sidebar/SidebarGroup'
import { SidebarHeader } from '@/shared/ui/sidebar/SidebarHeader'
import { SidebarMenu } from '@/shared/ui/sidebar/SidebarMenu'
import { SidebarMenuButton } from '@/shared/ui/sidebar/SidebarMenuButton'
import { SidebarMenuItem } from '@/shared/ui/sidebar/SidebarMenuItem'
import { SidebarRail } from '@/shared/ui/sidebar/SidebarRail'
import { P } from '@/shared/ui/ui/typography'
import { Home } from 'lucide-react'
import { useState } from 'react'
import { HashRouter, useNavigate } from 'react-router-dom'
import { AppRouter } from './router'
import { SiteHeader } from './SiteHeader'

const navSections = [
  {
    label: 'Character Build',
    items: [
      { to: '/build', label: 'Build' },
      { to: '/build/race', label: 'Race' },
      { to: '/build/birth-signs', label: 'Birth Signs' },
      { to: '/build/traits', label: 'Traits' },
      { to: '/build/religions', label: 'Religion' },
      { to: '/build/destiny', label: 'Destiny' },
      { to: '/build/perks', label: 'Skills and Perks' },
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
      { to: '/shouts', label: 'Shouts of the Dragonborn' },
      { to: '/lichdom', label: 'Lichdom' },
      { to: '/lycanthropy', label: 'Lycanthropy' },
      { to: '/vampirism', label: 'Vampirism' },
    ],
  },
  {
    label: 'Test',
    items: [
      { to: '/races-mva-demo', label: 'Races MVA Demo' },
      { to: '/skills-mva', label: 'Skills MVA' },
    ],
  },
]

function AppSidebar({ collapsed }: { collapsed: boolean }) {
  const navigate = useNavigate()
  const currentPath = window.location.hash.replace(/^#\/?/, '/')

  // Custom navigation that preserves build parameters
  const navigateWithBuild = (to: string) => {
    const currentHash = window.location.hash
    const [currentPath, paramsString] = currentHash.split('?')
    const params = new URLSearchParams(paramsString || '')
    const buildParam = params.get('b')

    if (buildParam) {
      // Preserve the build parameter when navigating
      navigate(`${to}?b=${buildParam}`)
    } else {
      // No build parameter, just navigate normally
      navigate(to)
    }
  }

  return (
    <Sidebar collapsed={collapsed}>
      <SidebarHeader>
        {!collapsed && (
          <button
            onClick={() => navigateWithBuild('/')}
            className="flex items-center justify-center w-full gap-2 hover:bg-skyrim-gold/15 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] rounded px-2 py-1 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-skyrim-gold/50 focus:ring-offset-1"
          >
            <Home className="w-4 h-4 text-skyrim-gold transition-transform duration-200 group-hover:scale-110" />
            <span className="text-sm font-semibold text-skyrim-gold tracking-wide">
              Home
            </span>
          </button>
        )}
      </SidebarHeader>
      <SidebarContent>
        {navSections.map(section => (
          <SidebarGroup key={section.label}>
            {!collapsed && (
              <div className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-skyrim-gold/60">
                {section.label}
              </div>
            )}
            <SidebarMenu>
              {section.items.map(item => {
                const isActive = currentPath === item.to
                return (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      onClick={() => navigateWithBuild(item.to)}
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
        <div className="flex-shrink-0 px-3 py-2 border-t border-skyrim-gold/20 text-center">
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

// Component that uses URL sync inside Router context
function AppContent() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Initialize URL sync for build state (now inside Router context)
  useURLSync()

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SiteHeader
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(c => !c)}
      />
      <div className="flex flex-1">
        <div
          className={`transition-all duration-300 ease-in-out ${
            sidebarCollapsed ? 'w-0' : 'w-64'
          }`}
          style={{ zIndex: Z_INDEX.SIDEBAR }}
        >
          <AppSidebar collapsed={sidebarCollapsed} />
        </div>
        <main className={`flex-1  transition-all duration-300 ease-in-out`}>
          <AppRouter />
        </main>
      </div>
      <FloatingBuildButton />
    </div>
  )
}

function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  )
}

export default App
