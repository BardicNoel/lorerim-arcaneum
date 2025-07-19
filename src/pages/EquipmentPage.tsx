import { H1, Muted } from '@/shared/ui/ui/typography'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/shared/ui/ui/card'

export default function EquipmentPage() {
  return (
    <div className="space-y-6">
      <div>
        <H1>Equipment</H1>
        <Muted>Browse and compare weapons, armor, and items</Muted>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            Equipment database is under development
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Muted>
            This section will provide a comprehensive database of all equipment
            in the game.
          </Muted>
        </CardContent>
      </Card>
    </div>
  )
}
