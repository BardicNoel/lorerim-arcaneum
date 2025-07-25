import {
  EntityDisplayCard,
  type EntityDetail,
} from '@/shared/components/playerCreation'
import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import { useNavigate } from 'react-router-dom'
import { useRaces } from '../hooks/useRaces'
import { AttributeProgressBars } from './AttributeProgressBars'
import { RaceAvatar } from './RaceAvatar'

interface RaceDisplayCardProps {
  className?: string
}

export function RaceDisplayCard({ className }: RaceDisplayCardProps) {
  const { allRaces } = useRaces()
  const { build } = useCharacterBuild()
  const navigate = useNavigate()

  // Find the selected race
  const selectedRace = build.race
    ? allRaces.find(race => race.edid === build.race)
    : null

  // Convert race to EntityDetail format
  const raceDetail: EntityDetail | null = selectedRace
    ? {
        id: selectedRace.edid,
        name: selectedRace.name,
        description: selectedRace.description,
        category: selectedRace.category,
        tags: selectedRace.keywords.map(k => k.edid),
        stats: [
          { label: 'Health', value: selectedRace.startingStats.health },
          { label: 'Magicka', value: selectedRace.startingStats.magicka },
          { label: 'Stamina', value: selectedRace.startingStats.stamina },
          {
            label: 'Carry Weight',
            value: selectedRace.startingStats.carryWeight,
          },
        ],
        effects: selectedRace.racialSpells.map(spell => ({
          name: spell.name,
          description: spell.description,
          type: 'positive' as const,
        })),
        abilities: selectedRace.skillBonuses.map(bonus => ({
          name: `${bonus.skill} +${bonus.bonus}`,
          description: `Starting bonus to ${bonus.skill}`,
        })),
        // Additional race-specific data
        regeneration: selectedRace.regeneration,
        combat: selectedRace.combat,
        physicalAttributes: selectedRace.physicalAttributes,
      }
    : null

  const handleNavigateToRacePage = () => {
    navigate('/race')
  }

  const renderRaceAvatar = (entity: EntityDetail) => (
    <RaceAvatar raceName={entity.name} size="lg" />
  )

  const renderRaceStats = (entity: EntityDetail) => {
    const regeneration = entity.regeneration
    const combat = entity.combat

    return (
      <div className="space-y-3">
        {/* Attribute Progress Bars */}
        <AttributeProgressBars
          health={entity.stats?.find(stat => stat.label === 'Health')?.value as number || 0}
          stamina={entity.stats?.find(stat => stat.label === 'Stamina')?.value as number || 0}
          magicka={entity.stats?.find(stat => stat.label === 'Magicka')?.value as number || 0}
        />

        {/* Regeneration Stats */}
        {regeneration && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Regeneration</h4>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center p-2 bg-muted rounded">
                <div className="font-medium">Health</div>
                <div className="text-muted-foreground">
                  {regeneration.health.base}/s
                </div>
              </div>
              <div className="text-center p-2 bg-muted rounded">
                <div className="font-medium">Magicka</div>
                <div className="text-muted-foreground">
                  {regeneration.magicka.base}/s
                </div>
              </div>
              <div className="text-center p-2 bg-muted rounded">
                <div className="font-medium">Stamina</div>
                <div className="text-muted-foreground">
                  {regeneration.stamina.base}/s
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Combat Stats */}
        {combat && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Combat</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-center p-2 bg-muted rounded">
                <div className="font-medium">Unarmed Damage</div>
                <div className="text-muted-foreground">
                  {combat.unarmedDamage}
                </div>
              </div>
              <div className="text-center p-2 bg-muted rounded">
                <div className="font-medium">Unarmed Reach</div>
                <div className="text-muted-foreground">
                  {combat.unarmedReach}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <EntityDisplayCard
      title="Race Details"
      entity={raceDetail}
      onNavigateToPage={handleNavigateToRacePage}
      className={className}
      renderAvatar={renderRaceAvatar}
      renderStats={renderRaceStats}
      placeholder="No race selected"
    />
  )
}
