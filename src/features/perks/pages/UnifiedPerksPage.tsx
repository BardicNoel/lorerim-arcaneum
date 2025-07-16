import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/ui/card";
import { Button } from "@/shared/ui/ui/button";
import { Badge } from "@/shared/ui/ui/badge";
import { usePerks, usePerkPlan } from "../hooks/usePerks";
import { PerkTreeCanvas } from "../components/PerkTreeCanvas";

export function UnifiedPerksPage() {
  const { perkTrees, loading, error } = usePerks();
  const [selectedTreeId, setSelectedTreeId] = useState<string | null>(null);

  // Get the selected tree
  const selectedTree = perkTrees.find(tree => tree.treeId === selectedTreeId);

  // Use perk plan for the selected tree
  const { perkPlan, togglePerk, clearSkill, clearAll } = usePerkPlan(selectedTree);

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

      {/* Skill Selector Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {perkTrees.map((tree) => {
              const skillPerks = perkPlan.selectedPerks[tree.treeName] || [];
              const isSelected = selectedTreeId === tree.treeId;
              
              return (
                <button
                  key={tree.treeId}
                  onClick={() => setSelectedTreeId(tree.treeId)}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    isSelected
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{tree.treeName}</div>
                      <div className="text-xs text-muted-foreground">
                        {skillPerks.length} perks
                      </div>
                    </div>
                    {skillPerks.length > 0 && (
                      <Badge variant="secondary" className="text-xs">{skillPerks.length}</Badge>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Perk Tree Canvas - Full Width */}
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
            selectedPerks={selectedPerks}
          />
        </CardContent>
      </Card>

      {/* Summary - Bottom */}
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
              <span className="font-medium">Total Perks:</span>
              <span className="text-lg font-bold">{perkPlan.totalPerks}</span>
            </div>
            
            {selectedTree && (
              <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                <div>
                  <span className="font-medium">{selectedTree.treeName}:</span>
                  <div className="text-sm text-muted-foreground">
                    {selectedPerks.length} perks selected
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={clearSkill}
                >
                  Clear
                </Button>
              </div>
            )}
            
            <div className="flex justify-center items-center">
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
  );
} 