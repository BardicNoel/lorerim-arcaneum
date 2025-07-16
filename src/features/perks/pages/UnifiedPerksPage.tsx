import { useState } from 'react';
import { SkillSelector } from '../components/SkillSelector';
import { SummarySidebar } from '../components/SummarySidebar';
import { PerkTreeCanvas } from '../components/PerkTreeCanvas';
import { usePerks, usePerkPlan, useSkills } from '../hooks';

export function UnifiedPerksPage() {
  const { perks, loading, error } = usePerks();
  const { perkPlan, togglePerk, updatePerkRank, clearSkill, clearAll } = usePerkPlan();
  const { skills } = useSkills();
  
  const [selectedSkill, setSelectedSkill] = useState('archery');

  const handleSkillSelect = (skillId: string) => {
    setSelectedSkill(skillId);
  };

  const handlePerkToggle = (perkId: string) => {
    togglePerk(perkId, selectedSkill);
  };

  const handlePerkRankChange = (perkId: string, newRank: number) => {
    updatePerkRank(perkId, selectedSkill, newRank);
  };

  const handleClearSkill = (skillId: string) => {
    clearSkill(skillId);
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold">Loading perks...</h3>
          <p className="text-muted-foreground">Please wait while we load the perk data.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-destructive">Error loading perks</h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b p-4">
        <h1 className="text-2xl font-bold">Perk Planner</h1>
        <p className="text-muted-foreground">
          Plan your character's perk progression across all skills
        </p>
      </div>

      {/* Skill Selector */}
      <div className="border-b p-4">
        <SkillSelector
          skills={skills}
          selectedSkill={selectedSkill}
          onSkillSelect={handleSkillSelect}
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Summary Sidebar */}
        <div className="w-80 border-r p-4">
          <SummarySidebar
            perkPlan={perkPlan}
            skills={skills}
            onSkillClick={handleSkillSelect}
            onClearSkill={handleClearSkill}
            onClearAll={clearAll}
          />
        </div>

        {/* Perk Tree Canvas */}
        <div className="flex-1 p-4">
          <PerkTreeCanvas
            perks={perks}
            selectedSkill={selectedSkill}
            onPerkToggle={handlePerkToggle}
            onPerkRankChange={handlePerkRankChange}
          />
        </div>
      </div>
    </div>
  );
} 