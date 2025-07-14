import { H1, Muted } from '@/shared/ui/ui/typography';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/ui/card';

export default function SkillsPage() {
  return (
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
  );
} 