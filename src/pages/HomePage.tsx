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
import { ArrowRight, FileText, Search, Sparkles, User, ExternalLink, Settings, Users, Sword, RotateCcw, BookOpen, UserCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const navigate = useNavigate()

  const handleCharacterBuild = () => {
    navigate('/build')
  }

  const externalTools = [
    {
      name: 'GigaPlanner',
      description: 'Advanced build planner with detailed skill trees and optimization',
      url: 'https://multidyls.github.io/GigaPlanner',
      icon: <Settings className="h-5 w-5 text-primary" />,
      category: 'Build Planning',
      author: 'Multidyls'
    },
    {
      name: 'Character Builder GPT',
      description: 'AI-powered character creation assistant with personalized build recommendations',
      url: 'https://chatgpt.com/g/g-68462f6313d48191bab174806a049ca4-lorerim-builds-wizard-v2?model=gpt-4o',
      icon: <Users className="h-5 w-5 text-primary" />,
      category: 'AI Assistant',
      author: 'Zoldyg'
    },
    {
      name: 'Alchemy Calculator',
      description: 'Comprehensive alchemy crafting and ingredient database with detailed recipes',
      url: 'https://docs.google.com/spreadsheets/d/1zUVCaRlqHX_sER-kJR-ZLIAfsFbTj9FQCO-hMfnp4XA/edit?gid=2066962651#gid=2066962651',
      icon: <Sparkles className="h-5 w-5 text-primary" />,
      category: 'Crafting',
      author: 'Rudy'
    },
    {
      name: 'Spell Sheet Generator',
      description: 'Lorerim Spell List Google Sheet',
      url: 'https://docs.google.com/spreadsheets/d/1fvYHRfwAprpgEPaXyuteEx0ud9S572noYnlpVq6cJFs/edit?gid=915313506#gid=915313506',
      icon: <BookOpen className="h-5 w-5 text-primary" />,
      category: 'Spells',
      author: 'ImmatureTurtles'
    },
    {
      name: 'Weapons Discussion Hub',
      description: 'Deep dive into weapon mechanics, damage calculations, and optimization strategies',
      url: 'https://discord.com/channels/622647066719420427/1382033558754955354',
      icon: <Sword className="h-5 w-5 text-primary" />,
      category: 'Combat',
      author: 'Deo'
    },
    {
      name: 'Spin Wheel Tool',
      description: 'Random build generator and challenge creator for fun playthroughs',
      url: 'https://spinthewheel.app/YXGCPykcqJ',
      icon: <RotateCcw className="h-5 w-5 text-primary" />,
      category: 'Fun',
      author: 'Sora the Saint'
    }
  ]

  const handleExternalLink = (url: string) => {
    if (url !== '#') {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Hero Section */}
        <div className="text-left space-y-6">
          <div className="flex items-center gap-3 mb-4 justify-start">
            <H1 className="text-4xl md:text-6xl font-bold text-foreground">
              Lorerim Arcaneum
            </H1>
          </div>
                     <Lead className="text-xl md:text-2xl text-muted-foreground">
             A growing collection of Lorerim tools and resources. Build characters, explore mechanics, and contribute to the community.
           </Lead>
           <p className="text-sm text-muted-foreground mt-2">
             Big thanks to Biggie Boss
           </p>
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
                   <UserCheck className="h-8 w-8 mx-auto mb-2 text-primary" />
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

                 {/* Favorite Tools Section */}
         <div className="space-y-6">
           <div className="text-center">
             <h2 className="text-2xl font-bold flex items-center justify-center gap-2 mb-2 text-foreground">
                               <Settings className="h-6 w-6 text-primary" />
               Favorite Tools
             </h2>
             <p className="text-muted-foreground">
               Discover the best external tools and resources for Lorerim theorycrafting
             </p>
           </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {externalTools.map((tool, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/30 cursor-pointer group bg-card"
                onClick={() => handleExternalLink(tool.url)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {tool.icon}
                      <CardTitle className="text-lg group-hover:text-primary transition-colors text-card-foreground">
                        {tool.name}
                      </CardTitle>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-xs font-medium text-primary/80 bg-primary/10 px-2 py-1 rounded-full">
                      {tool.category}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      by {tool.author}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-muted-foreground">
                    {tool.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

                     
         </div>
 
         {/* Footer Section */}
         <div className="text-left pt-8 border-t border-border">
           <p className="text-muted-foreground">
             Crafted by Bardic (Jeremy) Noel, with gratitude to Biggie Boss and the Lorerim community
           </p>
         </div>
         
       </div>
     </div>
   )
 }
