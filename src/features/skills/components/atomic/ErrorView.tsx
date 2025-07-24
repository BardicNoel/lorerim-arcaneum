import React from 'react'
import { AlertCircle } from 'lucide-react'

// Pure error component
interface ErrorViewProps {
  error: string
}

export function ErrorView({ error }: ErrorViewProps) {
  return (
    <div className="container mx-auto p-6">
      <div className="text-center text-red-600">
        <AlertCircle className="h-12 w-12 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">Error Loading Skills</h1>
        <p className="text-muted-foreground">{error}</p>
      </div>
    </div>
  )
} 