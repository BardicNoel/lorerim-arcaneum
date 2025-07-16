import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card';
import { Button } from '@/shared/ui/ui/button';
import { ScrollArea } from '@/shared/ui/ui/scroll-area';
import type { PerkPlan, Skill } from '../types';

interface SummarySidebarProps {
  perkPlan: PerkPlan;
  skills: Skill[];
  onSkillClick: (skillId: string) => void;
  onClearSkill: (skillId: string) => void;
  onClearAll: () => void;
}

export function SummarySidebar({
  perkPlan,
  skills,
  onSkillClick,
  onClearSkill,
  onClearAll,
}: SummarySidebarProps) {
  const skillsWithPerks = skills.filter(skill => 
    perkPlan.selectedPerks[skill.id]?.length > 0
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Perk Summary</span>
          <Button
            variant="outline"
            size="sm"
            onClick={onClearAll}
            disabled={perkPlan.totalPerks === 0}
          >
            Clear All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-4">
            {skillsWithPerks.length === 0 ? (
              <p className="text-center text-muted-foreground">
                No perks selected yet. Select a skill and choose some perks!
              </p>
            ) : (
              <>
                {skillsWithPerks.map((skill) => {
                  const selectedPerks = perkPlan.selectedPerks[skill.id] || [];
                  const minLevel = perkPlan.minLevels[skill.id] || 0;
                  
                  return (
                    <div
                      key={skill.id}
                      className="cursor-pointer rounded-lg border p-3 transition-colors hover:bg-muted"
                      onClick={() => onSkillClick(skill.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{skill.icon}</span>
                          <span className="font-medium">{skill.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onClearSkill(skill.id);
                          }}
                        >
                          Clear
                        </Button>
                      </div>
                      <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                        <div>Selected Perks: {selectedPerks.length}</div>
                        <div>Min Level: {minLevel}</div>
                      </div>
                    </div>
                  );
                })}
                
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Total Perks</span>
                    <span className="text-lg font-bold">{perkPlan.totalPerks}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
} 