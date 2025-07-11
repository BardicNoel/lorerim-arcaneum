import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/ui/card'
import { Button } from '@/shared/ui/ui/button'

// Proof of Concept Page
const PocPage = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
    <Card className="w-full max-w-md shadow-lg border-2 border-primary">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">ShadCN Proof of Concept</CardTitle>
        <CardDescription className="text-lg">If you see color, shadow, and spacing, ShadCN and Tailwind are working!</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 items-center">
        <Button size="lg" className="w-full">Primary Button</Button>
        <Button variant="secondary" size="lg" className="w-full">Secondary Button</Button>
        <Button variant="destructive" size="lg" className="w-full">Destructive Button</Button>
        <div className="w-full mt-4 p-4 rounded-lg bg-destructive/10 text-destructive border border-destructive">
          This is a custom alert box using Tailwind and ShadCN colors.
        </div>
      </CardContent>
    </Card>
  </div>
)

// Placeholder components for routes
const PlayerCreation = () => (
  <div className="p-8">
    <h1 className="text-3xl mb-4">Player Creation</h1>
    <p className="text-muted-foreground">Player creation feature coming soon...</p>
  </div>
)

const Equipment = () => (
  <div className="p-8">
    <h1 className="text-3xl mb-4">Equipment</h1>
    <p className="text-muted-foreground">Equipment feature coming soon...</p>
  </div>
)

const Crafting = () => (
  <div className="p-8">
    <h1 className="text-3xl mb-4">Crafting</h1>
    <p className="text-muted-foreground">Crafting feature coming soon...</p>
  </div>
)

const Skills = () => (
  <div className="p-8">
    <h1 className="text-3xl mb-4">Skills</h1>
    <p className="text-muted-foreground">Skills feature coming soon...</p>
  </div>
)

const Home = () => (
  <div className="p-8">
    <h1 className="text-4xl mb-6 text-primary">Lorerim Arcaneum</h1>
    <p className="text-lg mb-4 text-muted-foreground">
      Welcome to the theorycrafting playground and reference hub for Lorerim players.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
      <Card>
        <CardHeader>
          <CardTitle>Player Creation</CardTitle>
          <CardDescription>Design your character with races, traits, and birthsigns</CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Equipment</CardTitle>
          <CardDescription>Browse and compare weapons, armor, and items</CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Crafting</CardTitle>
          <CardDescription>Plan your crafting recipes and material requirements</CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
          <CardDescription>Explore skill trees and perk combinations</CardDescription>
        </CardHeader>
      </Card>
    </div>
  </div>
)

export const AppRouter = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/player-creation" element={<PlayerCreation />} />
        <Route path="/equipment" element={<Equipment />} />
        <Route path="/crafting" element={<Crafting />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/poc" element={<PocPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
} 