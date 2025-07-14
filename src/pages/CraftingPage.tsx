import { H1, Muted } from '@/shared/ui/ui/typography';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/ui/card';

export default function CraftingPage() {
  return (
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
  );
} 