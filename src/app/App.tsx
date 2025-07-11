import { AppRouter } from './router'
import { Card } from '@/shared/ui/ui/card'
import { Button } from '@/shared/ui/ui/button'


const Navigation = () => {
  return (
    <Card className="rounded-none border-b shadow-none p-0 bg-secondary text-secondary-foreground">
      <nav className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <a href="#/" className="text-primary font-bold text-2xl font-cinzel">
            Lorerim Arcaneum
          </a>
          <div className="flex gap-2">
            <Button asChild variant="ghost" size="sm" className="text-foreground hover:text-primary">
              <a href="#/">Home</a>
            </Button>
            <Button asChild variant="ghost" size="sm" className="text-foreground hover:text-primary">
              <a href="#/player-creation">Player Creation</a>
            </Button>
            <Button asChild variant="ghost" size="sm" className="text-foreground hover:text-primary">
              <a href="#/equipment">Equipment</a>
            </Button>
            <Button asChild variant="ghost" size="sm" className="text-foreground hover:text-primary">
              <a href="#/crafting">Crafting</a>
            </Button>
            <Button asChild variant="ghost" size="sm" className="text-foreground hover:text-primary">
              <a href="#/skills">Skills</a>
            </Button>
          </div>
        </div>
      </nav>
    </Card>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground font-crimson">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <AppRouter />
      </main>
    </div>
  )
}

export default App
