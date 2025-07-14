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

const navSections = [
  {
    items: [
      { to: '/', label: 'Home' },
    ],
  },
  {
    label: 'Character Creation',
    items: [
      { to: '/race', label: 'Race' }, 
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

function AppSidebar() {
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const currentPath = window.location.hash.replace(/^#\/?/, '/')

  return (
    <Sidebar collapsed={collapsed}>
      <SidebarHeader>
        <button
          className="flex items-center gap-2 text-skyrim-gold/90 hover:text-skyrim-gold text-xs font-bold px-1 py-1 focus:outline-none"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <span className="w-7 h-7 bg-skyrim-gold rounded-lg flex items-center justify-center text-skyrim-dark font-bold text-xs shrink-0">
            LA
          </span>
          {!collapsed && (
            <span className="ml-1 leading-tight truncate">
              Lorerim Arcaneum
            </span>
          )}
          <span className="ml-auto text-base font-bold px-1">
            {collapsed ? '→' : '←'}
          </span>
        </button>
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
  return (
    <HashRouter>
      <div className="min-h-screen bg-background text-foreground flex">
        <AppSidebar />
        <main className="flex-1 p-8">
          <AppRouter />
        </main>
      </div>
    </HashRouter>
  )
}

export default App
