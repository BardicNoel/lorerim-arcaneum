import { RaceSelectionCard } from '@/features/races/components'
import { TraitSelectionCard } from '@/features/traits/components'
import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import { Input } from '@/shared/ui/ui/input'
import { Label } from '@/shared/ui/ui/label'
import { AlertTriangle, Info, RotateCcw, Share2 } from 'lucide-react'
import BuildPageDestinyCard from '@/features/destiny/components/BuildPageDestinyCard'
import {  useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/ui/tabs'
import { Button } from '@/shared/ui/ui/button'

import React from 'react'

export function BuildPage() {
  const { build, setBuildName, setBuildNotes, updateBuild, resetBuild, setDestinyPath } =
    useCharacterBuild()

  const [regularLimit, setRegularLimit] = useState(build.traitLimits.regular)
  const [bonusLimit, setBonusLimit] = useState(build.traitLimits.bonus)
  const [showConfirm, setShowConfirm] = useState(false)
  const [copied, setCopied] = useState(false)

  const navigate = useNavigate()

  const handleRegularLimitChange = (value: string) => {
    const numValue = parseInt(value) || 0
    setRegularLimit(numValue)
    updateBuild({
      traitLimits: { ...build.traitLimits, regular: numValue },
    })
  }

  const handleBonusLimitChange = (value: string) => {
    const numValue = parseInt(value) || 0
    setBonusLimit(numValue)
    updateBuild({
      traitLimits: { ...build.traitLimits, bonus: numValue },
    })
  }

  const isUsingCustomLimits = regularLimit !== 2 || bonusLimit !== 1

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Character Builder</h1>
      </div>
      {/* Build Controls Area */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant="destructive"
          size="sm"
          className="text-destructive-foreground cursor-pointer hover:opacity-90"
          onClick={() => setShowConfirm(true)}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset Build
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer hover:opacity-90"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href)
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
          }}
        >
          <Share2 className="w-4 h-4 mr-2" />
          Export / Share
        </Button>
        {copied && (
          <span className="text-green-600 text-sm ml-2">Link copied!</span>
        )}
      </div>
      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 w-full max-w-xs space-y-4 border border-border">
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-yellow-600 dark:text-yellow-400 h-5 w-5" />
              <span className="font-semibold">Reset Build?</span>
            </div>
            <p className="text-sm text-muted-foreground">
              This will clear all selections and start a new build. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowConfirm(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="text-destructive-foreground cursor-pointer hover:opacity-90"
                onClick={() => {
                  resetBuild()
                  setShowConfirm(false)
                }}
              >
                Confirm Reset
              </Button>
            </div>
          </div>
        </div>
      )}

      <Tabs defaultValue="build" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="build">Build</TabsTrigger>
          <TabsTrigger value="config">Config</TabsTrigger>
        </TabsList>
        <TabsContent value="build">
          {/* Basic Information (always below tabs) */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Character Name</Label>
                <Input
                  id="name"
                  value={build.name}
                  onChange={e => setBuildName(e.target.value)}
                  placeholder="Enter character name..."
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <textarea
                  id="notes"
                  value={build.notes}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setBuildNotes(e.target.value)
                  }
                  placeholder="Add character notes, roleplay details, or build explanations..."
                  rows={4}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Race Selection and Display */}
            <RaceSelectionCard />
            {/* Trait Selection and Display */}
            <TraitSelectionCard />
          </div>

          {/* Destiny Section */}
          <BuildPageDestinyCard navigate={navigate} />

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
                    {build.traits.regular.length}/{regularLimit} starting,{' '}
                    {build.traits.bonus.length}/{bonusLimit} late game
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="config">
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
                    Default configuration is 2 starting + 1 late game traits.
                  </strong>
                  Increasing these limits requires corresponding MCM (Mod
                  Configuration Menu) changes in-game. Make sure your MCM settings
                  match these limits to avoid conflicts.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="regular-limit">Starting Traits Limit</Label>
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
                    Currently selected: {build.traits.regular.length}
                  </p>
                </div>
                <div>
                  <Label htmlFor="bonus-limit">Late Game Traits Limit</Label>
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
                    Currently selected: {build.traits.bonus.length}
                  </p>
                </div>
              </div>

              {isUsingCustomLimits && (
                <div className="flex items-start gap-2 p-4 rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
                  <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <strong>Custom limits detected:</strong> {regularLimit} starting
                    + {bonusLimit} late game traits. Remember to update your MCM
                    settings accordingly.
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
