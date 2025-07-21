import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import { Input } from '@/shared/ui/ui/input'
import { Label } from '@/shared/ui/ui/label'

interface BasicInfoCardProps {
  name: string
  notes: string
  onNameChange: (name: string) => void
  onNotesChange: (notes: string) => void
  className?: string
}

/**
 * Basic Information Card Component
 * 
 * Handles character name and notes input for the build page.
 * This follows the birthsigns pattern of feature-specific components
 * that delegate to shared UI components.
 */
export function BasicInfoCard({
  name,
  notes,
  onNameChange,
  onNotesChange,
  className,
}: BasicInfoCardProps) {
  return (
    <Card className={`mb-6 ${className || ''}`}>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="name">Character Name</Label>
          <Input
            id="name"
            value={name}
            onChange={e => onNameChange(e.target.value)}
            placeholder="Enter character name..."
          />
        </div>
        <div>
          <Label htmlFor="notes">Notes</Label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              onNotesChange(e.target.value)
            }
            placeholder="Add character notes, roleplay details, or build explanations..."
            rows={4}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </CardContent>
    </Card>
  )
} 