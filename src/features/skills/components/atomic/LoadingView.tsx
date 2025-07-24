import React from 'react'

// Pure loading component
export function LoadingView() {
  return (
    <div className="container mx-auto p-6">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">Loading Skills...</h1>
        <p className="text-muted-foreground">Initializing skill and perk data...</p>
      </div>
    </div>
  )
} 