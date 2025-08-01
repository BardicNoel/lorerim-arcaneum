import React from 'react'
import type { SearchResult } from '../../model/SearchModel'

// Fallback components for unknown types
export const FallbackCard: React.FC<{
  result: SearchResult
  isSelected?: boolean
  onClick?: () => void
}> = ({ result, isSelected, onClick }) => (
  <div
    className={`p-4 border rounded-lg bg-muted cursor-pointer ${isSelected ? 'ring-2 ring-primary' : ''}`}
    onClick={onClick}
  >
    <h3 className="font-semibold">{result.item.name}</h3>
    <p className="text-sm text-muted-foreground">{result.item.description}</p>
  </div>
)

export const FallbackDetail: React.FC<{ result: SearchResult }> = ({ result }) => (
  <div className="p-4 border rounded-lg bg-muted">
    <h2 className="text-lg font-semibold mb-4">{result.item.name}</h2>
    <p className="text-sm text-muted-foreground mb-4">
      {result.item.description}
    </p>
    <div className="text-xs text-muted-foreground">
      Type: {result.item.type} | ID: {result.item.id}
    </div>
  </div>
) 