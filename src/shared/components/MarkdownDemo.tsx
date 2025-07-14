import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import { MarkdownText } from './MarkdownText'

export function MarkdownDemo() {
  const demoTexts = [
    {
      title: "Acoustic Arcanist",
      text: "Your magic flows through melody and vibration. After playing an instrument at an inn, your sonic spells become ***20%*** more powerful. However, your booming presence makes hiring followers more expensive, and your reliance on sound magic weakens your physical attacks by ***15%***."
    },
    {
      title: "Adrenaline Rush", 
      text: "You possess a natural flight response. When at less than ***20%*** health, you move ***20%*** faster and regenerate ***1*** stamina per second but also deal ***30%*** less damage when below this threshold."
    },
    {
      title: "Au Naturel",
      text: "Embrace your divine gifts! Start with ***+100*** health, magicka, and stamina. For each piece of armor or clothing you wear, you lose ***40*** from each attribute (up to a maximum loss of ***-160*** with four pieces equipped). Additionally, you gain +1 to health, magicka, and stamina per level for each empty armor slot (head, chest, hands, and feet)."
    }
  ]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Markdown Rendering Demo</h2>
        <p className="text-muted-foreground">
          Examples of how trait descriptions are rendered with markdown support
        </p>
      </div>
      
      <div className="grid gap-6">
        {demoTexts.map((demo, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{demo.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <MarkdownText>
                {demo.text}
              </MarkdownText>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 