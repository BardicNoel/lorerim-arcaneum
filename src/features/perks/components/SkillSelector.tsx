import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/ui/tabs';
import type { Skill } from '../types';

interface SkillSelectorProps {
  skills: Skill[];
  selectedSkill: string;
  onSkillSelect: (skillId: string) => void;
}

export function SkillSelector({ skills, selectedSkill, onSkillSelect }: SkillSelectorProps) {
  return (
    <div className="w-full">
      <Tabs value={selectedSkill} onValueChange={onSkillSelect}>
        <TabsList className="grid w-full grid-cols-6 lg:grid-cols-9 xl:grid-cols-18">
          {skills.map((skill) => (
            <TabsTrigger
              key={skill.id}
              value={skill.id}
              className="flex flex-col items-center gap-1 p-2 text-xs"
            >
              <span className="text-lg">{skill.icon}</span>
              <span className="hidden sm:block">{skill.name}</span>
              {skill.selectedPerks > 0 && (
                <span className="rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
                  {skill.selectedPerks}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {skills.map((skill) => (
          <TabsContent key={skill.id} value={skill.id} className="mt-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold">{skill.name}</h3>
              <p className="text-sm text-muted-foreground">{skill.description}</p>
              <div className="mt-2 flex justify-center gap-4 text-sm">
                <span>Selected Perks: {skill.selectedPerks}</span>
                <span>Min Level: {skill.minLevel}</span>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
} 