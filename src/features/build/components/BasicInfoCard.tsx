import React, { useState, useEffect, useCallback } from 'react'
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
 * 
 * Both name and notes fields use local state with debounced updates to prevent laggy typing.
 */
export function BasicInfoCard({
  name,
  notes,
  onNameChange,
  onNotesChange,
  className,
}: BasicInfoCardProps) {
  // Local state for name and notes to prevent laggy typing
  const [localName, setLocalName] = useState(name)
  const [localNotes, setLocalNotes] = useState(notes)
  
  // Debounced update to zustand store for name
  const debouncedUpdateName = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout
      return (value: string) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          onNameChange(value)
        }, 300) // 300ms debounce delay
      }
    })(),
    [onNameChange]
  )

  // Debounced update to zustand store for notes
  const debouncedUpdateNotes = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout
      return (value: string) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          onNotesChange(value)
        }, 300) // 300ms debounce delay
      }
    })(),
    [onNotesChange]
  )

  // Update local state when props change (e.g., from URL sync)
  useEffect(() => {
    setLocalName(name)
  }, [name])

  useEffect(() => {
    setLocalNotes(notes)
  }, [notes])

  // Handle name change with local state and debounced update
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLocalName(value) // Update local state immediately
    debouncedUpdateName(value) // Debounce update to zustand store
  }

  // Handle notes change with local state and debounced update
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setLocalNotes(value) // Update local state immediately
    debouncedUpdateNotes(value) // Debounce update to zustand store
  }

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
            value={localName}
            onChange={handleNameChange}
            placeholder="Enter character name..."
          />
        </div>
        <div>
          <Label htmlFor="notes">Notes</Label>
          <textarea
            id="notes"
            value={localNotes}
            onChange={handleNotesChange}
            placeholder="Add character notes, roleplay details, or build explanations..."
            rows={4}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </CardContent>
    </Card>
  )
}
