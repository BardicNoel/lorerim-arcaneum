import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/ui/card";
import { Button } from "@/shared/ui/ui/button";
import { Badge } from "@/shared/ui/ui/badge";
import { usePerks, usePerkPlan, useSkills } from "../hooks/usePerks";
import { PerkTreeCanvas } from "../components/PerkTreeCanvas";
import type { PerkTree } from "../types";

export function UnifiedPerksPage() {
  const { perkTrees, loading, error } = usePerks();
  const { skills } = useSkills();
  const [selectedTreeId, setSelectedTreeId] = useState<string | null>(null);

  // Get the selected tree
  const selectedTree = perkTrees.find(tree => tree.treeId === selectedTreeId);

  // Use perk plan for the selected tree
  const { perkPlan, togglePerk, updatePerkRank, clearSkill, clearAll } = usePerkPlan(selectedTree);

  // Get selected perks for the current tree
  const selectedPerks = selectedTree 
    ? perkPlan.selectedPerks[selectedTree.treeName] || []
    : [];

  // Auto-select first tree if none selected
  React.useEffect(() => {
    if (!selectedTreeId && perkTrees.length > 0) {
      setSelectedTreeId(perkTrees[0].treeId);
    }
  }, [selectedTreeId, perkTrees]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading perk trees...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Perk Planner</h1>
        <p className="text-muted-foreground">
          Plan your character's perk progression through skill trees
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Skill Selector */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {perkTrees.map((tree) => {
                  const skillPerks = perkPlan.selectedPerks[tree.treeName] || [];
                  const isSelected = selectedTreeId === tree.treeId;
                  
                  return (
                    <button
                      key={tree.treeId}
                      onClick={() => setSelectedTreeId(tree.treeId)}
                      className={`w-full p-3 rounded-lg border text-left transition-colors ${
                        isSelected
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{tree.treeName}</div>
                          <div className="text-sm text-muted-foreground">
                            {skillPerks.length} perks selected
                          </div>
                        </div>
                        {skillPerks.length > 0 && (
                          <Badge variant="secondary">{skillPerks.length}</Badge>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Perks:</span>
                  <span className="font-medium">{perkPlan.totalPerks}</span>
                </div>
                {selectedTree && (
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span>{selectedTree.treeName}:</span>
                      <div className="flex gap-2">
                        <span className="font-medium">
                          {selectedPerks.length} perks
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={clearSkill}
                        >
                          Clear
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                <div className="pt-2 border-t">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={clearAll}
                    className="w-full"
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Perk Tree Canvas */}
        <div className="lg:col-span-3">
          <Card className="h-[600px]">
            <CardHeader>
              <CardTitle>
                {selectedTree ? selectedTree.treeName : "Select a Skill"}
              </CardTitle>
            </CardHeader>
            <CardContent className="h-full p-0">
              <PerkTreeCanvas
                tree={selectedTree}
                onTogglePerk={togglePerk}
                onUpdateRank={updatePerkRank}
                selectedPerks={selectedPerks}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 