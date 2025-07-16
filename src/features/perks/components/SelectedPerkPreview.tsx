import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/ui/card";
import { Button } from "@/shared/ui/ui/button";
import { Badge } from "@/shared/ui/ui/badge";
import type { PerkNode } from "../types";

interface SelectedPerkPreviewProps {
  selectedPerk: PerkNode | null;
  onTogglePerk: (perkId: string) => void;
  onUpdateRank: (perkId: string, newRank: number) => void;
}

export function SelectedPerkPreview({ 
  selectedPerk, 
  onTogglePerk, 
  onUpdateRank 
}: SelectedPerkPreviewProps) {
  if (!selectedPerk) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">Perk Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Select a perk to view details
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleRankIncrement = () => {
    if (selectedPerk.currentRank < selectedPerk.ranks) {
      onUpdateRank(selectedPerk.perkId, selectedPerk.currentRank + 1);
    }
  };

  const handleRankDecrement = () => {
    if (selectedPerk.currentRank > 0) {
      onUpdateRank(selectedPerk.perkId, selectedPerk.currentRank - 1);
    }
  };

  const hasPrerequisites = selectedPerk.prerequisites.perks && selectedPerk.prerequisites.perks.length > 0;
  const hasSkillLevelRequirement = selectedPerk.prerequisites.skillLevel;
  const hasItemRequirements = selectedPerk.prerequisites.items && selectedPerk.prerequisites.items.length > 0;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{selectedPerk.perkName}</CardTitle>
          <Badge variant="outline">Lv {selectedPerk.level}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Description */}
        <div>
          <h4 className="font-medium mb-2">Description</h4>
          <div 
            className="text-sm text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: selectedPerk.perkDescription }}
          />
        </div>

        {/* Ranks */}
        {selectedPerk.ranks > 1 && (
          <div>
            <h4 className="font-medium mb-2">Ranks</h4>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleRankDecrement}
                disabled={selectedPerk.currentRank <= 0}
              >
                -
              </Button>
              <span className="text-sm font-medium min-w-[40px] text-center">
                {selectedPerk.currentRank}/{selectedPerk.ranks}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleRankIncrement}
                disabled={selectedPerk.currentRank >= selectedPerk.ranks}
              >
                +
              </Button>
            </div>
          </div>
        )}

        {/* Prerequisites */}
        {(hasPrerequisites || hasSkillLevelRequirement || hasItemRequirements) && (
          <div>
            <h4 className="font-medium mb-2">Prerequisites</h4>
            <div className="space-y-2 text-sm">
              {hasSkillLevelRequirement && selectedPerk.prerequisites.skillLevel && (
                <div className="text-muted-foreground">
                  <span className="font-medium">Skill Level:</span> {selectedPerk.prerequisites.skillLevel.skill} {selectedPerk.prerequisites.skillLevel.level}
                </div>
              )}
              {hasPrerequisites && selectedPerk.prerequisites.perks && (
                <div className="text-muted-foreground">
                  <span className="font-medium">Perk Prerequisites:</span> {selectedPerk.prerequisites.perks.length} required
                </div>
              )}
              {hasItemRequirements && selectedPerk.prerequisites.items && (
                <div className="text-muted-foreground">
                  <span className="font-medium">Item Prerequisites:</span> {selectedPerk.prerequisites.items.length} required
                </div>
              )}
            </div>
          </div>
        )}

        {/* Effects */}
        {selectedPerk.effects.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Effects</h4>
            <div className="space-y-1">
              {selectedPerk.effects.map((effect, index) => (
                <div key={index} className="text-sm text-muted-foreground">
                  <span className="font-medium">{effect.type}:</span> {effect.function}
                  {effect.priority !== undefined && (
                    <span className="ml-2 text-xs">(Priority: {effect.priority})</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-4">
          <Button 
            className="w-full"
            variant={selectedPerk.selected ? "destructive" : "default"}
            onClick={() => onTogglePerk(selectedPerk.perkId)}
          >
            {selectedPerk.selected ? "Remove Perk" : "Add Perk"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 