import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import { Button } from '@/shared/ui/ui/button'
import { Badge } from '@/shared/ui/ui/badge'
import { Separator } from '@/shared/ui/ui/separator'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/shared/ui/ui/drawer'
import { LoadingView, ErrorView } from '../atomic'
import { SkillGrid, SkillSearch, SkillFilters } from '../composition'
import { PerkTreeViewMVA } from './PerkTreeViewMVA'
import type { UnifiedSkill } from '../../adapters'

// High-level view component that consumes adapters
interface SkillsPageViewProps {
  skills: UnifiedSkill[]
  loading: boolean
  error: string | null
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedCategory: string | null
  onCategorySelect: (category: string | null) => void
  categories: string[]
  selectedSkillId: string | null
  onSkillSelect: (skillId: string) => void
  onAssignMajor: (skillId: string) => void
  onAssignMinor: (skillId: string) => void
  onRemoveAssignment: (skillId: string) => void
  skillSummary: {
    majorCount: number
    minorCount: number
    majorLimit: number
    minorLimit: number
    totalSkills: number
    totalPerks: number
    totalPerkRanks: number
  }
}

export function SkillsPageView({
  skills,
  loading,
  error,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategorySelect,
  categories,
  selectedSkillId,
  onSkillSelect,
  onAssignMajor,
  onAssignMinor,
  onRemoveAssignment,
  skillSummary,
}: SkillsPageViewProps) {
  // Local state for perk tree drawer
  const [perkTreeOpen, setPerkTreeOpen] = useState(false)

  if (loading) {
    return <LoadingView />
  }
  
  if (error) {
    return <ErrorView error={error} />
  }

  // Transform skills to the format expected by SkillGrid
  const gridSkills = skills.map(skill => ({
    id: skill.id,
    name: skill.name,
    description: skill.description,
    category: skill.category,
    assignmentType: skill.assignmentType,
    perkCount: `${skill.selectedPerksCount}/${skill.totalPerks}`,
    canAssignMajor: skill.canAssignMajor,
    canAssignMinor: skill.canAssignMinor,
  }))
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Skills & Perks</h1>
        <p className="text-muted-foreground">
          Manage your character's skills and perk selections
        </p>
      </div>
      
      {/* Build Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Build Summary</span>
            <div className="flex gap-2">
              <Badge 
                variant="outline" 
                className="bg-yellow-50 text-yellow-800 border-yellow-300"
              >
                {skillSummary.majorCount}/{skillSummary.majorLimit} Major
              </Badge>
              <Badge 
                variant="outline" 
                className="bg-gray-50 text-gray-800 border-gray-300"
              >
                {skillSummary.minorCount}/{skillSummary.minorLimit} Minor
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Total Skills</p>
              <p className="font-semibold">{skillSummary.totalSkills}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Selected Perks</p>
              <p className="font-semibold">{skillSummary.totalPerks}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Perk Ranks</p>
              <p className="font-semibold">{skillSummary.totalPerkRanks}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Available Major</p>
              <p className="font-semibold text-yellow-600">
                {skillSummary.majorLimit - skillSummary.majorCount}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Search and Filters */}
      <div className="space-y-4">
        <SkillSearch 
          query={searchQuery} 
          onQueryChange={onSearchChange} 
        />
        
        <SkillFilters
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={onCategorySelect}
        />
      </div>
      
      <Separator />
      
      {/* Skills Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Available Skills</h2>
          <p className="text-sm text-muted-foreground">
            {skills.length} skills found
          </p>
        </div>
        
        <SkillGrid
          skills={gridSkills}
          onSkillSelect={(skillId) => {
            onSkillSelect(skillId)
            setPerkTreeOpen(true)
          }}
          onAssignMajor={onAssignMajor}
          onAssignMinor={onAssignMinor}
          onRemoveAssignment={onRemoveAssignment}
          selectedSkillId={selectedSkillId || undefined}
        />
      </div>
      
      {/* Perk Tree Drawer */}
      <Drawer open={perkTreeOpen} onOpenChange={setPerkTreeOpen}>
        <DrawerContent className="max-h-[90vh] bg-background border-0 shadow-2xl">
          <DrawerHeader className="bg-background border-b">
            <DrawerTitle>
              {selectedSkillId && skills.find(s => s.id === selectedSkillId)?.name
                ? `${skills.find(s => s.id === selectedSkillId)?.name} Perk Tree`
                : 'Perk Tree'
              }
            </DrawerTitle>
            <DrawerDescription>
              Select and manage perks for this skill
            </DrawerDescription>
          </DrawerHeader>
          
          <div className="flex-1 overflow-auto bg-background min-h-[400px]">
            {selectedSkillId && (
              <PerkTreeViewMVA
                skillId={selectedSkillId}
                skillName={skills.find(s => s.id === selectedSkillId)?.name || 'Unknown Skill'}
                skillCategory={skills.find(s => s.id === selectedSkillId)?.category || 'Unknown'}
                onClose={() => setPerkTreeOpen(false)}
              />
            )}
          </div>
        </DrawerContent>
      </Drawer>
      
      {/* Assignment Instructions */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-2">How to Assign Skills</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Major Skills (0-3)</p>
              <p>Your primary skills that level up faster and start at a higher level.</p>
            </div>
            <div>
              <p className="text-muted-foreground">Minor Skills (0-6)</p>
              <p>Secondary skills that provide additional benefits and customization.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 