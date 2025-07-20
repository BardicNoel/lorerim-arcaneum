import { FloatingBuildButton } from '@/shared/components/FloatingBuildButton'
import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import { Badge } from '@/shared/ui/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import { Input } from '@/shared/ui/ui/input'
import { Label } from '@/shared/ui/ui/label'
import { Switch } from '@/shared/ui/ui/switch'
import { AlertTriangle, Info } from 'lucide-react'
import { useState } from 'react'

export function BuildPage() {
  const {
    build,
    setName,
    setNotes,
    setGameCompleted,
    isGameCompleted,
    setRegularTraitLimit,
    setBonusTraitLimit,
    getRegularTraitLimit,
    getBonusTraitLimit,
    getRegularTraitCount,
    getBonusTraitCount,
  } = useCharacterBuild()

  const [regularLimit, setRegularLimit] = useState(getRegularTraitLimit())
  const [bonusLimit, setBonusLimit] = useState(getBonusTraitLimit())

  const handleRegularLimitChange = (value: string) => {
    const numValue = parseInt(value) || 0
    setRegularLimit(numValue)
    setRegularTraitLimit(numValue)
  }

  const handleBonusLimitChange = (value: string) => {
    const numValue = parseInt(value) || 0
    setBonusLimit(numValue)
    setBonusTraitLimit(numValue)
  }

  const isUsingCustomLimits = regularLimit !== 2 || bonusLimit !== 1

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Character Builder</h1>
        <FloatingBuildButton />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Character Name</Label>
              <Input
                id="name"
                value={build.name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter character name..."
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                value={build.notes}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setNotes(e.target.value)
                }
                placeholder="Add character notes, roleplay details, or build explanations..."
                rows={4}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </CardContent>
        </Card>

        {/* Game Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Game Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="game-completed">Game Completed</Label>
                <p className="text-sm text-muted-foreground">
                  Unlocks late game trait slot
                </p>
              </div>
              <Switch
                id="game-completed"
                checked={isGameCompleted()}
                onCheckedChange={setGameCompleted}
              />
            </div>
            {isGameCompleted() && (
              <Badge variant="secondary" className="w-fit">
                Late game traits unlocked
              </Badge>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Trait Limits Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Trait Limits Configuration
            <Info className="h-4 w-4 text-muted-foreground" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-2 p-4 rounded-lg border border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
            <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <strong>
                Default configuration is 2 regular + 1 extra unlock traits.
              </strong>
              Increasing these limits requires corresponding MCM (Mod
              Configuration Menu) changes in-game. Make sure your MCM settings
              match these limits to avoid conflicts.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="regular-limit">Regular Traits Limit</Label>
              <Input
                id="regular-limit"
                type="number"
                min="0"
                max="10"
                value={regularLimit}
                onChange={e => handleRegularLimitChange(e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Currently selected: {getRegularTraitCount()}
              </p>
            </div>
            <div>
              <Label htmlFor="bonus-limit">Extra Unlock Traits Limit</Label>
              <Input
                id="bonus-limit"
                type="number"
                min="0"
                max="5"
                value={bonusLimit}
                onChange={e => handleBonusLimitChange(e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Currently selected: {getBonusTraitCount()}
                {!isGameCompleted() && ' (requires game completion)'}
              </p>
            </div>
          </div>

          {isUsingCustomLimits && (
            <div className="flex items-start gap-2 p-4 rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <strong>Custom limits detected:</strong> {regularLimit} regular
                + {bonusLimit} extra unlock traits. Remember to update your MCM
                settings accordingly.
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Build Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Build Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium">Race:</span>
              <div className="text-muted-foreground">
                {build.race || 'Not selected'}
              </div>
            </div>
            <div>
              <span className="font-medium">Birth Sign:</span>
              <div className="text-muted-foreground">
                {build.stone || 'Not selected'}
              </div>
            </div>
            <div>
              <span className="font-medium">Religion:</span>
              <div className="text-muted-foreground">
                {build.religion || 'Not selected'}
              </div>
            </div>
            <div>
              <span className="font-medium">Traits:</span>
              <div className="text-muted-foreground">
                {getRegularTraitCount()}/{regularLimit} regular,{' '}
                {getBonusTraitCount()}/{bonusLimit} extra unlock
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
