import { HashRouter } from 'react-router-dom'
import { AppRouter } from './router'
import { useNavigate } from 'react-router-dom'
import { H1, P } from '@/shared/ui/ui/typography'
import { Button } from '@/shared/ui/ui/button'

const navSections = [
  {
    label: 'Get Started',
    items: [
      { to: '/', label: 'Home' },
      { to: '/player-creation', label: 'Player Creation' },
      { to: '/equipment', label: 'Equipment' },
      { to: '/crafting', label: 'Crafting' },
      { to: '/skills', label: 'Skills' },
      { to: '/typography', label: 'Typography Demo' },
    ],
  },
]

function Sidebar() {
  const navigate = useNavigate()
  const currentPath = window.location.hash.replace(/^#\/?/, '/')

  return (
    <div className="w-56 bg-background border-r border-border min-h-screen">
      <div className="p-6 border-b border-border">
        <H1 className="text-lg font-bold text-foreground">Lorerim Arcaneum</H1>
        <P className="text-xs text-muted-foreground mt-1">Theorycrafting Hub</P>
      </div>
      <nav className="p-4 flex flex-col gap-8">
        {navSections.map((section) => (
          <div key={section.label}>
            <div className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {section.label}
            </div>
            <ul className="flex flex-col gap-1 list-none p-0 m-0">
              {section.items.map((item) => {
                const isActive = currentPath === item.to
                return (
                  <li key={item.to}>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => navigate(item.to)}
                      className={
                        'w-full text-left px-4 py-2.5 rounded-full text-sm transition-colors ' +
                        (isActive
                          ? 'bg-muted font-bold text-foreground'
                          : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground')
                      }
                    >
                      {item.label}
                    </Button>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  )
}

function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-background text-foreground flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <AppRouter />
        </main>
      </div>
    </HashRouter>
  )
}

export default App
