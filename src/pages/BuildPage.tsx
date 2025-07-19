import { useCharacterStore } from '@/shared/stores/characterStore'
import { Button } from '@/shared/ui/ui/button'
import { Input } from '@/shared/ui/ui/input'
import { Label } from '@/shared/ui/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/ui/card'

export default function BuildPage() {
  const { build, updateBuild, resetBuild } = useCharacterStore()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-skyrim-gold mb-2">
          Character Builder
        </h1>
        <p className="text-muted-foreground">
          Your build state is automatically synced to the URL. Copy the URL to
          share your character!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Character Details */}
        <Card>
          <CardHeader>
            <CardTitle>Character Details</CardTitle>
            <CardDescription>Basic character information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Character Name</Label>
              <Input
                id="name"
                placeholder="Enter character name"
                value={build.name}
                onChange={e => updateBuild({ name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Character Notes</Label>
              <textarea
                id="notes"
                placeholder="Enter character background, roleplay notes, etc."
                value={build.notes}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  updateBuild({ notes: e.target.value })
                }
                rows={4}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </CardContent>
        </Card>

        {/* Race Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Race</CardTitle>
            <CardDescription>Select your character's race</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="race">Race</Label>
              <select
                id="race"
                className="w-full p-2 border rounded-md bg-background"
                value={build.race || ''}
                onChange={e => updateBuild({ race: e.target.value || null })}
              >
                <option value="">Select a race...</option>
                <option value="nord">Nord</option>
                <option value="imperial">Imperial</option>
                <option value="breton">Breton</option>
                <option value="redguard">Redguard</option>
                <option value="altmer">Altmer</option>
                <option value="bosmer">Bosmer</option>
                <option value="dunmer">Dunmer</option>
                <option value="orsimer">Orsimer</option>
                <option value="khajiit">Khajiit</option>
                <option value="argonian">Argonian</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Birth Sign */}
        <Card>
          <CardHeader>
            <CardTitle>Birth Sign</CardTitle>
            <CardDescription>Select your birth sign</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="stone">Birth Sign</Label>
              <select
                id="stone"
                className="w-full p-2 border rounded-md bg-background"
                value={build.stone || ''}
                onChange={e => updateBuild({ stone: e.target.value || null })}
              >
                <option value="">Select a birth sign...</option>
                <option value="warrior">The Warrior</option>
                <option value="mage">The Mage</option>
                <option value="thief">The Thief</option>
                <option value="lady">The Lady</option>
                <option value="steed">The Steed</option>
                <option value="lord">The Lord</option>
                <option value="apprentice">The Apprentice</option>
                <option value="atronach">The Atronach</option>
                <option value="ritual">The Ritual</option>
                <option value="lover">The Lover</option>
                <option value="shadow">The Shadow</option>
                <option value="tower">The Tower</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Religion */}
        <Card>
          <CardHeader>
            <CardTitle>Religion</CardTitle>
            <CardDescription>Select your character's religion</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="religion">Religion</Label>
              <select
                id="religion"
                className="w-full p-2 border rounded-md bg-background"
                value={build.religion || ''}
                onChange={e =>
                  updateBuild({ religion: e.target.value || null })
                }
              >
                <option value="">Select a religion...</option>
                <option value="nine_divines">Nine Divines</option>
                <option value="daedra">Daedra Worship</option>
                <option value="ancestor">Ancestor Worship</option>
                <option value="none">No Religion</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
          <CardDescription>Manage your character build</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={resetBuild} variant="destructive">
              Reset Build
            </Button>
            <Button
              onClick={() => {
                const url = window.location.href
                navigator.clipboard.writeText(url)
                alert('URL copied to clipboard!')
              }}
            >
              Copy Share URL
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Debug: Current Build State */}
      <Card>
        <CardHeader>
          <CardTitle>Current Build State (Debug)</CardTitle>
          <CardDescription>
            JSON representation of your current build
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-md text-sm overflow-auto">
            {JSON.stringify(build, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}
