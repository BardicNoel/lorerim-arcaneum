import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import { Button } from '@/shared/ui/ui/button'
import { useCharacterStore } from '@/shared/stores/characterStore'
import { AttributeAssignmentCard } from './composition/AttributeAssignmentCard'

export function AttributeAssignmentDemo() {
  const { setAttributeAssignment, updateAttributeLevel } = useCharacterStore()
  
  const setupDemoData = () => {
    // Set character to level 10
    updateAttributeLevel(10)
    
    // Set some example assignments
    setAttributeAssignment(2, 'health')
    setAttributeAssignment(3, 'stamina')
    setAttributeAssignment(4, 'magicka')
    setAttributeAssignment(5, 'health')
    setAttributeAssignment(6, 'stamina')
    setAttributeAssignment(7, 'magicka')
    setAttributeAssignment(8, 'health')
    setAttributeAssignment(9, 'stamina')
    setAttributeAssignment(10, 'magicka')
  }
  
  const clearDemoData = () => {
    useCharacterStore.getState().clearAllAttributeAssignments()
    updateAttributeLevel(1)
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Attribute Assignment Feature Demo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This demo showcases the attribute assignment tracking feature. Players can assign Health, Stamina, or Magicka increases for each character level.
          </p>
          
          <div className="flex gap-2">
            <Button onClick={setupDemoData} variant="outline" size="sm">
              Load Demo Data
            </Button>
            <Button onClick={clearDemoData} variant="outline" size="sm">
              Clear Demo Data
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground">
            <p>• Click "Load Demo Data" to see a level 10 character with sample assignments</p>
            <p>• Use the expandable card below to interact with the feature</p>
            <p>• Click level buttons to cycle through attribute assignments</p>
          </div>
        </CardContent>
      </Card>
      
      <AttributeAssignmentCard />
    </div>
  )
} 