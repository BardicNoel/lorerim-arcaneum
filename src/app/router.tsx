import { Routes, Route, Navigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/ui/card'
import { Button } from '@/shared/ui/ui/button'
import { H1, H2, H3, H4, H5, H6, P, Blockquote, Code, Lead, Large, Small, Muted } from '@/shared/ui/ui/typography'
import { User, Shield, Hammer, BookOpen, Type } from 'lucide-react'

// Typography Demo Page
const TypographyDemo = () => (
  <div className="space-y-6">
    <div>
      <H1>Typography</H1>
      <Lead>
        A collection of typography components for consistent text styling.
      </Lead>
    </div>

    <div className="space-y-8">
      <div className="space-y-4">
        <H2>Headings</H2>
        <div className="space-y-2">
          <H1>The Joke Tax</H1>
          <H2>The People of the Kingdom</H2>
          <H3>The King's Plan</H3>
          <H4>An Unexpected Journey</H4>
          <H5>The Fellowship of the Ring</H5>
          <H6>The Return of the King</H6>
        </div>
      </div>

      <div className="space-y-4">
        <H2>Text</H2>
        <div className="space-y-2">
          <P>
            The king, seeing how much happier his subjects were, realized the error of his ways and repealed the joke tax.
          </P>
          <P>
            The people cheered and all the birds were happy. The end.
          </P>
        </div>
      </div>

      <div className="space-y-4">
        <H2>Lists</H2>
        <div className="space-y-2">
          <P>Here are some things to remember:</P>
          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li>Always be kind to others</li>
            <li>Remember to laugh</li>
            <li>Share your knowledge</li>
          </ul>
        </div>
      </div>

      <div className="space-y-4">
        <H2>Blockquote</H2>
        <Blockquote>
          "After all," he said, "everyone enjoys a good joke, so it's only fair that they should pay for the privilege."
        </Blockquote>
      </div>

      <div className="space-y-4">
        <H2>Code</H2>
        <div className="space-y-2">
          <P>
            The king was a wise man, and he knew that <Code>jokes</Code> were the key to happiness.
          </P>
        </div>
      </div>

      <div className="space-y-4">
        <H2>Lead</H2>
        <Lead>
          A modal dialog that interrupts the user with important content and expects a response.
        </Lead>
      </div>

      <div className="space-y-4">
        <H2>Large</H2>
        <Large>Are you sure absolutely sure?</Large>
      </div>

      <div className="space-y-4">
        <H2>Small</H2>
        <Small>Email address</Small>
      </div>

      <div className="space-y-4">
        <H2>Muted</H2>
        <Muted>Enter your email address.</Muted>
      </div>
    </div>
  </div>
)

// Placeholder components for routes
const PlayerCreation = () => (
  <div className="space-y-6">
    <div>
      <H1>Player Creation</H1>
      <Muted>Design your character with races, traits, and birthsigns</Muted>
    </div>
    <Card>
      <CardHeader>
        <CardTitle>Coming Soon</CardTitle>
        <CardDescription>Player creation feature is under development</CardDescription>
      </CardHeader>
      <CardContent>
        <Muted>
          This section will allow you to create and customize your character with various options.
        </Muted>
      </CardContent>
    </Card>
  </div>
)

const Equipment = () => (
  <div className="space-y-6">
    <div>
      <H1>Equipment</H1>
      <Muted>Browse and compare weapons, armor, and items</Muted>
    </div>
    <Card>
      <CardHeader>
        <CardTitle>Coming Soon</CardTitle>
        <CardDescription>Equipment database is under development</CardDescription>
      </CardHeader>
      <CardContent>
        <Muted>
          This section will provide a comprehensive database of all equipment in the game.
        </Muted>
      </CardContent>
    </Card>
  </div>
)

const Crafting = () => (
  <div className="space-y-6">
    <div>
      <H1>Crafting</H1>
      <Muted>Plan your crafting recipes and material requirements</Muted>
    </div>
    <Card>
      <CardHeader>
        <CardTitle>Coming Soon</CardTitle>
        <CardDescription>Crafting system is under development</CardDescription>
      </CardHeader>
      <CardContent>
        <Muted>
          This section will help you plan and optimize your crafting projects.
        </Muted>
      </CardContent>
    </Card>
  </div>
)

const Skills = () => (
  <div className="space-y-6">
    <div>
      <H1>Skills</H1>
      <Muted>Explore skill trees and perk combinations</Muted>
    </div>
    <Card>
      <CardHeader>
        <CardTitle>Coming Soon</CardTitle>
        <CardDescription>Skills system is under development</CardDescription>
      </CardHeader>
      <CardContent>
        <Muted>
          This section will provide detailed information about skills and perks.
        </Muted>
      </CardContent>
    </Card>
  </div>
)

const Home = () => (
  <div className="space-y-8">
    <div>
      <H1>Welcome to Lorerim Arcaneum</H1>
      <Lead>
        Your theorycrafting playground and reference hub for Lorerim players.
      </Lead>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Player Creation
          </CardTitle>
          <CardDescription>Design your character with races, traits, and birthsigns</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline" className="w-full">
            <a href="#/player-creation">Get Started</a>
          </Button>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Equipment
          </CardTitle>
          <CardDescription>Browse and compare weapons, armor, and items</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline" className="w-full">
            <a href="#/equipment">Browse Items</a>
          </Button>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hammer className="h-5 w-5" />
            Crafting
          </CardTitle>
          <CardDescription>Plan your crafting recipes and material requirements</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline" className="w-full">
            <a href="#/crafting">Start Crafting</a>
          </Button>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Skills
          </CardTitle>
          <CardDescription>Explore skill trees and perk combinations</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline" className="w-full">
            <a href="#/skills">View Skills</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  </div>
)

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/player-creation" element={<PlayerCreation />} />
      <Route path="/equipment" element={<Equipment />} />
      <Route path="/crafting" element={<Crafting />} />
      <Route path="/skills" element={<Skills />} />
      <Route path="/typography" element={<TypographyDemo />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
} 