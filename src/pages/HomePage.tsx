import { BuildStatus } from '@/shared/components/BuildStatus'
import { Button } from '@/shared/ui/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/ui/card'
import { H1, Lead } from '@/shared/ui/ui/typography'
import { ArrowRight, FileText, Search, Sparkles, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const navigate = useNavigate()

  const handleCharacterBuild = () => {
    navigate('/build')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Hero Section */}
        <div className="text-left space-y-6">
          <div className="flex items-center gap-3 mb-4 justify-start">
            <H1 className="text-4xl md:text-6xl font-bold text-foreground">
              Lorerim Arcaneum
            </H1>
          </div>
          <Lead className="text-xl md:text-2xl text-muted-foreground">
            Your theorycrafting playground and reference hub for Lorerim
            players. Build characters, explore mechanics, and dive deep into the
            lore.
          </Lead>
        </div>

        {/* Character Build Status */}
        <div className="max-w-md">
          <BuildStatus />
        </div>

        {/* Main Navigation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Character Building Section */}
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold flex items-center justify-center gap-2 mb-2 text-foreground">
                <User className="h-6 w-6 text-primary" />
                Character Building
              </h2>
              <p className="text-muted-foreground">
                Create and customize your character from scratch
              </p>
            </div>

            <Card
              className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/30 cursor-pointer group bg-card"
              onClick={handleCharacterBuild}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 group-hover:text-primary transition-colors text-card-foreground">
                  <Sparkles className="h-5 w-5" />
                  Start Character Build
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Design your character with races, traits, birthsigns, and more
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  Begin Building
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              <Card
                className="hover:shadow-md transition-shadow cursor-pointer bg-card"
                onClick={() => navigate('/build/race')}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">👤</div>
                  <div className="font-medium text-sm text-card-foreground">
                    Races
                  </div>
                </CardContent>
              </Card>

              <Card
                className="hover:shadow-md transition-shadow cursor-pointer bg-card"
                onClick={() => navigate('/build/birth-signs')}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">⭐</div>
                  <div className="font-medium text-sm text-card-foreground">
                    Birthsigns
                  </div>
                </CardContent>
              </Card>

              <Card
                className="hover:shadow-md transition-shadow cursor-pointer bg-card"
                onClick={() => navigate('/build/traits')}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">🎯</div>
                  <div className="font-medium text-sm text-card-foreground">
                    Traits
                  </div>
                </CardContent>
              </Card>

              <Card
                className="hover:shadow-md transition-shadow cursor-pointer bg-card"
                onClick={() => navigate('/build/perks')}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">⚔️</div>
                  <div className="font-medium text-sm text-card-foreground">
                    Skills
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quick Access Section */}
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold flex items-center justify-center gap-2 mb-2 text-foreground">
                <Search className="h-6 w-6 text-primary" />
                Quick Access
              </h2>
              <p className="text-muted-foreground">
                Jump directly to specific tools and features
              </p>
            </div>

            <div className="space-y-3">
              <Card
                className="hover:shadow-md transition-shadow cursor-pointer bg-card"
                onClick={() => navigate('/search')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Search className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium text-card-foreground">
                        Advanced Search
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Detailed search with filters
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className="hover:shadow-md transition-shadow cursor-pointer bg-card"
                onClick={() => navigate('/spells')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium text-card-foreground">
                        Spells
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Browse and search spells
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className="hover:shadow-md transition-shadow cursor-pointer bg-card"
                onClick={() => navigate('/cookbook')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium text-card-foreground">
                        Cookbook
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Crafting recipes & guides
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="text-left pt-8 border-t border-border">
          <p className="text-muted-foreground">
            Built with ❤️ for the Lorerim community
          </p>
        </div>
      </div>
    </div>
  )
}
