import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import { Button } from '@/shared/ui/ui/button'
import { Badge } from '@/shared/ui/ui/badge'
import { useCharacterStore } from '@/shared/stores/characterStore'
import { AttributeAssignmentCard } from './AttributeAssignmentCard'

export function AttributeAssignmentDemo() {
  const { setAttributeAssignment, updateAttributeLevel, clearAllAttributeAssignments } = useCharacterStore()

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
    clearAllAttributeAssignments()
    updateAttributeLevel(1)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🎯</span>
            Attribute Assignment Feature Demo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This demo showcases the enhanced attribute assignment tracking feature. Players can assign Health, Stamina, or Magicka increases for each character level.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">How to Assign Attributes:</h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>• <Badge variant="outline" className="text-xs">1</Badge> Set your character level using the level control</li>
                <li>• <Badge variant="outline" className="text-xs">2</Badge> Click any level button (2-{useCharacterStore.getState().build.attributeAssignments.level}) to assign Health</li>
                <li>• <Badge variant="outline" className="text-xs">3</Badge> Click again to cycle: Health → Stamina → Magicka</li>
                <li>• <Badge variant="outline" className="text-xs">4</Badge> Click once more to clear the assignment</li>
                <li>• <Badge variant="outline" className="text-xs">5</Badge> Use "Quick Assign" buttons for faster assignment</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Visual Indicators:</h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>• <span className="inline-block w-3 h-3 bg-red-500 rounded mr-1"></span> Red = Health assignment</li>
                <li>• <span className="inline-block w-3 h-3 bg-green-500 rounded mr-1"></span> Green = Stamina assignment</li>
                <li>• <span className="inline-block w-3 h-3 bg-blue-500 rounded mr-1"></span> Blue = Magicka assignment</li>
                <li>• Hover over buttons for tooltips with detailed info</li>
                <li>• Summary shows totals and ratios at the top</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={setupDemoData} variant="outline" size="sm">
              🎲 Load Demo Data (Level 10)
            </Button>
            <Button onClick={clearDemoData} variant="outline" size="sm">
              🗑️ Clear All Data
            </Button>
          </div>

          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-medium mb-1">💡 Try This:</p>
              <ol className="text-xs space-y-1">
                <li>1. Click "Load Demo Data" to see a level 10 character with sample assignments</li>
                <li>2. Expand the Attribute Assignment card below</li>
                <li>3. Try clicking different level buttons to see the assignment mechanism</li>
                <li>4. Use the "Quick Assign" buttons to quickly add more assignments</li>
                <li>5. Adjust the character level to see more assignment options</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      <AttributeAssignmentCard />
    </div>
  )
} 