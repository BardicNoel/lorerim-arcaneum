import { Z_INDEX } from '@/lib/constants'
import { ErrorBoundary } from '@/shared/components/ErrorBoundary'
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
import { Sheet, SheetContent, SheetTrigger } from '@/shared/ui/ui/sheet'
import { P } from '@/shared/ui/ui/typography'
import { Home } from 'lucide-react'
import { useEffect, useState } from 'react'
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
    label: 'Docs',
    items: [
      { to: '/spells', label: 'Spells' },
      { to: '/cookbook', label: 'Food and Alcohol' },
      { to: '/alchemy', label: 'Alchemy' },
      { to: '/enchantments', label: 'Enchantments' },
    ],
  },

  // {
  //   label: 'Gear',
  //   items: [
  //     { to: '/weapons', label: 'Weapons' },
  //     { to: '/armor', label: 'Armor' },
  //     { to: '/food', label: 'Food' },
  //     { to: '/alcohol', label: 'Alcohol' },
  //   ],
  // },
  // {
  //   label: 'Crafting',
  //   items: [
  //     { to: '/alchemy', label: 'Alchemy' },
  //     { to: '/smithing', label: 'Smithing' },
  //     { to: '/enchanting', label: 'Enchanting' },
  //   ],
  // },
  // {
  //   label: 'Ascensions',
  //   items: [
  //     { to: '/shouts', label: 'Shouts of the Dragonborn' },
  //     { to: '/lichdom', label: 'Lichdom' },
  //     { to: '/lycanthropy', label: 'Lycanthropy' },
  //     { to: '/vampirism', label: 'Vampirism' },
  //   ],
  // },
  // {
  //   label: 'Test',
  //   items: [
  //     { to: '/races-mva-demo', label: 'Races MVA Demo' },
  //     { to: '/skills-mva', label: 'Skills MVA' },
  //     { to: '/skills-experimental', label: 'Skills Experimental' },
  //   ],
  // },
]

// Shared navigation content component
function NavigationContent({
  onNavigate,
}: {
  onNavigate: (isMobile: boolean) => void
}) {
  const navigate = useNavigate()
  const currentPath = window.location.hash.replace(/^#\/?/, '/')

  // Custom navigation that preserves build parameters
  const navigateWithBuild = (to: string, isMobile: boolean) => {
    const currentHash = window.location.hash
    const [currentPath, paramsString] = currentHash.split('?')
    const params = new URLSearchParams(paramsString || '')
    const buildParam = params.get('b')

    if (buildParam) {
      // Preserve the build parameter when navigating using hash
      window.location.hash = `${to}?b=${buildParam}`
    } else {
      // No build parameter, just navigate normally
      navigate(to)
    }

    // Close sidebar/drawer after navigation (only on mobile)
    onNavigate(isMobile)
  }

  return (
    <>
      <div className="p-4 border-b border-skyrim-gold/20">
        <button
          onClick={() => navigateWithBuild('/', true)}
          className="flex items-center justify-center w-full gap-2 hover:bg-skyrim-gold/15 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] rounded px-2 py-1 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-skyrim-gold/50 focus:ring-offset-1"
        >
          <Home className="w-4 h-4 text-skyrim-gold transition-transform duration-200 group-hover:scale-110" />
          <span className="text-sm font-semibold text-skyrim-gold tracking-wide">
            Home
          </span>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {navSections.map(section => (
          <div key={section.label} className="mb-6">
            <div className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-skyrim-gold/60">
              {section.label}
            </div>
            <div className="space-y-1">
              {section.items.map(item => {
                const isActive = currentPath === item.to
                return (
                  <button
                    key={item.to}
                    onClick={() => navigateWithBuild(item.to, true)}
                    className={`w-full text-left px-3 py-2 text-sm font-medium rounded transition-all duration-200 ease-in-out hover:bg-skyrim-gold/15 hover:text-skyrim-gold hover:shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer focus:outline-none focus:ring-2 focus:ring-skyrim-gold/50 focus:ring-offset-1 ${
                      isActive
                        ? 'bg-skyrim-gold/20 text-skyrim-gold border-l-4 border-skyrim-gold font-bold shadow-sm'
                        : 'text-skyrim-gold/80 border-l-4 border-transparent'
                    }`}
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="flex-shrink-0 px-3 py-2 border-t border-skyrim-gold/20 text-center">
        <P className="text-xs text-skyrim-gold/50">Version 1.0.0</P>
        <button
          className="mt-2 text-skyrim-gold/70 hover:text-skyrim-gold hover:bg-skyrim-gold/10 text-xs rounded px-2 py-1"
          tabIndex={0}
        >
          ⚙️ Settings
        </button>
      </div>
    </>
  )
}

function AppSidebar({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean
  onNavigate: (isMobile: boolean) => void
}) {
  const navigate = useNavigate()
  const currentPath = window.location.hash.replace(/^#\/?/, '/')

  // Custom navigation that preserves build parameters
  const navigateWithBuild = (to: string) => {
    const currentHash = window.location.hash
    const [currentPath, paramsString] = currentHash.split('?')
    const params = new URLSearchParams(paramsString || '')
    const buildParam = params.get('b')

    if (buildParam) {
      // Preserve the build parameter when navigating using hash
      window.location.hash = `${to}?b=${buildParam}`
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

// Mobile drawer component
function MobileDrawer({
  onNavigate,
}: {
  onNavigate: (isMobile: boolean) => void
}) {
  const [open, setOpen] = useState(false)

  const handleNavigate = (isMobile: boolean) => {
    if (isMobile) {
      setOpen(false) // Close the drawer on mobile navigation
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          aria-label="Open navigation menu"
          className="flex items-center justify-center w-10 h-10 rounded transition-all duration-200 ease-in-out hover:bg-skyrim-gold/15 hover:shadow-md hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-skyrim-gold/50 focus:ring-offset-1"
        >
          <svg
            className="w-5 h-5 text-skyrim-gold"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-80">
        <div className="flex flex-col h-full">
          <NavigationContent onNavigate={handleNavigate} />
        </div>
      </SheetContent>
    </Sheet>
  )
}

// Component that uses URL sync inside Router context
function AppContent() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // Initialize URL sync for build state (now inside Router context)
  useURLSync()

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SiteHeader
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(c => !c)}
        isMobile={isMobile}
        MobileDrawerTrigger={() => <MobileDrawer onNavigate={() => {}} />}
      />
      <div className="flex flex-1">
        {!isMobile && (
          <div
            className={`transition-all duration-300 ease-in-out ${
              sidebarCollapsed ? 'w-0 overflow-hidden' : 'w-64'
            }`}
            style={{ zIndex: Z_INDEX.SIDEBAR }}
          >
            <AppSidebar
              collapsed={sidebarCollapsed}
              onNavigate={isMobile => {
                if (isMobile) {
                  setSidebarCollapsed(true)
                }
              }}
            />
          </div>
        )}
        <main
          className={`flex-1 transition-all duration-300 ease-in-out min-w-0`}
        >
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
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </HashRouter>
  )
}

export default App
