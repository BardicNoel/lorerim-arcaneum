import React from 'react'

interface VirtualizationLoadingScreenProps {
  message?: string
  showProgress?: boolean
  progress?: number
  totalItems?: number
}

export function VirtualizationLoadingScreen({
  message = "Measuring content layout...",
  showProgress = false,
  progress = 0,
  totalItems = 0
}: VirtualizationLoadingScreenProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px] bg-muted/50 rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-muted-foreground mb-2">{message}</p>
        {showProgress && totalItems > 0 && (
          <div className="w-48 mx-auto">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Measuring items...</span>
              <span>{progress}/{totalItems}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(progress / totalItems) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
