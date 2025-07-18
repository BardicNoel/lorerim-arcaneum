import { H1, Lead } from '@/shared/ui/ui/typography';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/ui/card';
import { Button } from '@/shared/ui/ui/button';
import { User, Shield, Hammer, BookOpen } from 'lucide-react';
import { BuildStatus } from '@/shared/components/BuildStatus';

export default function HomePage() {
  return (
    <div className="space-y-8">
      <div>
        <H1>Welcome to Lorerim Arcaneum</H1>
        <Lead>
          Your theorycrafting playground and reference hub for Lorerim players.
        </Lead>
      </div>
      
      {/* Character Build Status */}
      <div className="max-w-md">
        <BuildStatus />
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
  );
} 