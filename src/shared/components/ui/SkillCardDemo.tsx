import { CustomMultiAutocompleteSearch } from '@/features/skills/components/CustomMultiAutocompleteSearch'
import type { Skill } from '@/features/skills/types'
import { PlayerCreationLayout } from '@/shared/components/playerCreation'
import type {
  SearchCategory,
  SearchOption,
  SelectedTag,
} from '@/shared/components/playerCreation/types'
import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { SkillLevel } from './SkillCard'
import { SkillCard } from './SkillCard'

const MAX_MAJORS = 3
const MAX_MINORS = 3

export function SkillCardDemo() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTags, setSelectedTags] = useState<SelectedTag[]>([])

  // Use the global build state
  const {
    build,
    addMajorSkill,
    removeMajorSkill,
    addMinorSkill,
    removeMinorSkill,
    hasMajorSkill,
    hasMinorSkill,
    updateBuild,
  } = useCharacterBuild()

  // Load skills data from JSON file
  useEffect(() => {
    async function fetchSkills() {
      try {
        setLoading(true)
        const res = await fetch(`${import.meta.env.BASE_URL}data/skills.json`)
        if (!res.ok) throw new Error('Failed to fetch skills data')
        const data = await res.json()

        // Sort skills alphabetically by name
        const sortedSkills = (data.skills || []).sort((a: Skill, b: Skill) =>
          a.name.localeCompare(b.name)
        )
        setSkills(sortedSkills)
      } catch (err) {
        setError('Failed to load skills data')
        console.error('Error loading skills:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchSkills()
  }, [])

  const handleSkillLevelChange = (skillId: string, level: SkillLevel) => {
    // Remove from both major and minor first
    removeMajorSkill(skillId)
    removeMinorSkill(skillId)

    // Add to the appropriate category
    if (level === 'major') {
      addMajorSkill(skillId)
    } else if (level === 'minor') {
      addMinorSkill(skillId)
    }
    // If level is 'none', we've already removed it from both
  }

  // Helper function to get current skill level from build state
  const getSkillLevel = (skillId: string): SkillLevel => {
    if (hasMajorSkill(skillId)) return 'major'
    if (hasMinorSkill(skillId)) return 'minor'
    return 'none'
  }

  // Calculate current counts from build state
  const majorCount = build.skills.major.length
  const minorCount = build.skills.minor.length

  // Reset all skills function
  const resetAllSkills = () => {
    updateBuild({
      skills: {
        major: [],
        minor: [],
      },
    })
  }

  // Generate search categories for skills
  const generateSearchCategories = (): SearchCategory[] => {
    const allCategories = [...new Set(skills.map(skill => skill.category))]
    const allMetaTags = [...new Set(skills.flatMap(skill => skill.metaTags))]

    return [
      {
        id: 'fuzzy',
        name: 'Fuzzy Search',
        placeholder: 'Search by name, description, or abilities...',
        options: [], // Will be handled by fuzzy search
      },
      {
        id: 'categories',
        name: 'Skill Categories',
        placeholder: 'Filter by category...',
        options: allCategories.map(category => ({
          id: `category-${category}`,
          label: category,
          value: category,
          category: 'Skill Categories',
          description: `${category} skills`,
        })),
      },
      {
        id: 'meta-tags',
        name: 'Meta Tags',
        placeholder: 'Filter by tags...',
        options: allMetaTags.map(tag => ({
          id: `tag-${tag}`,
          label: tag,
          value: tag,
          category: 'Meta Tags',
          description: `Skills with ${tag} tag`,
        })),
      },
    ]
  }

  const searchCategories = generateSearchCategories()

  // Add a tag (from autocomplete or custom input)
  const handleTagSelect = (optionOrTag: SearchOption | string) => {
    let tag: SelectedTag
    if (typeof optionOrTag === 'string') {
      tag = {
        id: `custom-${optionOrTag}`,
        label: optionOrTag,
        value: optionOrTag,
        category: 'Fuzzy Search',
      }
    } else {
      tag = {
        id: `${optionOrTag.category}-${optionOrTag.id}`,
        label: optionOrTag.label,
        value: optionOrTag.value,
        category: optionOrTag.category,
      }
    }
    // Prevent duplicate tags
    if (
      !selectedTags.some(
        t => t.value === tag.value && t.category === tag.category
      )
    ) {
      setSelectedTags(prev => [...prev, tag])
    }
  }

  // Remove a tag
  const handleTagRemove = (tagId: string) => {
    setSelectedTags(prev => prev.filter(tag => tag.id !== tagId))
  }

  // Apply filters to skills
  const filteredSkills = skills.filter(skill => {
    // If no tags are selected, show all skills
    if (selectedTags.length === 0) return true

    // Check each selected tag
    return selectedTags.every(tag => {
      switch (tag.category) {
        case 'Fuzzy Search':
          // For fuzzy search, we'll handle this separately
          return true

        case 'Skill Categories':
          return skill.category === tag.value

        case 'Meta Tags':
          return skill.metaTags.includes(tag.value)

        default:
          return true
      }
    })
  })

  // Apply fuzzy search to the filtered skills
  const fuzzySearchQuery = selectedTags
    .filter(tag => tag.category === 'Fuzzy Search')
    .map(tag => tag.value)
    .join(' ')

  // Simple fuzzy search implementation
  const fuzzyFilteredSkills = fuzzySearchQuery
    ? filteredSkills.filter(skill => {
        const searchLower = fuzzySearchQuery.toLowerCase()
        return (
          skill.name.toLowerCase().includes(searchLower) ||
          skill.description.toLowerCase().includes(searchLower) ||
          skill.keyAbilities.some(ability =>
            ability.toLowerCase().includes(searchLower)
          ) ||
          skill.metaTags.some(tag => tag.toLowerCase().includes(searchLower))
        )
      })
    : filteredSkills

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading skills...</p>
        </div>
      </div>
    )
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
    )
  }

  return (
    <PlayerCreationLayout
      title="Skills"
      description="Choose your character's skills. Select up to 3 Major and 3 Minor skills to define your character's expertise and abilities."
    >
      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Custom MultiAutocompleteSearch */}
        <CustomMultiAutocompleteSearch
          categories={searchCategories}
          onSelect={handleTagSelect}
          onCustomSearch={handleTagSelect}
        />

        {/* Selected Tags */}
        <div className="my-4">
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              {/* Clear All Button */}
              <button
                onClick={() => setSelectedTags([])}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors duration-200 border border-border/50 hover:border-border cursor-pointer group"
                title="Clear all filters"
              >
                <X className="h-3.5 w-3.5 group-hover:scale-110 transition-transform duration-200" />
                Clear All
              </button>

              {/* Individual Tags */}
              {selectedTags.map(tag => (
                <span
                  key={tag.id}
                  className="inline-flex items-center px-3 py-1.5 rounded-full bg-skyrim-gold/20 border border-skyrim-gold/30 text-sm font-medium text-skyrim-gold hover:bg-skyrim-gold/30 transition-colors duration-200 cursor-pointer group"
                  onClick={() => handleTagRemove(tag.id)}
                  title="Click to remove"
                >
                  {tag.label}
                  <span className="ml-2 text-skyrim-gold/70 group-hover:text-skyrim-gold transition-colors duration-200">
                    ×
                  </span>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Current Skill Levels */}
      <div className="space-y-6">
        <div className="flex items-center justify-between h-10">
          <h3 className="text-lg font-semibold">Current Skill Levels</h3>
          {(majorCount > 0 || minorCount > 0) && (
            <button
              onClick={resetAllSkills}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 hover:border-red-300 transition-colors duration-200"
              title="Reset all skill selections"
            >
              <span className="text-lg">↺</span>
              Reset All Skills
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Major Skills Card */}
          <div className="rounded-lg border bg-gradient-to-r from-yellow-50/50 to-amber-50/50 p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-yellow-800 flex items-center gap-2">
                <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                Major Skills ({majorCount}/{MAX_MAJORS})
              </h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {build.skills.major.map(skillId => {
                const skill = skills.find(s => s.edid === skillId)
                if (!skill) return null

                return (
                  <div
                    key={skillId}
                    className="flex items-center gap-2 bg-yellow-100 border border-yellow-300 rounded-full px-3 py-1.5 text-sm font-medium text-yellow-800 hover:bg-yellow-200 transition-colors group"
                  >
                    <span>{skill.name}</span>
                    <button
                      onClick={() => handleSkillLevelChange(skill.edid, 'none')}
                      className="w-4 h-4 rounded-full bg-yellow-300 hover:bg-yellow-400 flex items-center justify-center text-yellow-800 hover:text-white transition-colors text-xs font-bold"
                      title="Remove skill"
                    >
                      ×
                    </button>
                  </div>
                )
              })}
              {build.skills.major.length === 0 && (
                <p className="text-yellow-600/70 text-sm italic">
                  No major skills selected
                </p>
              )}
            </div>
          </div>

          {/* Minor Skills Card */}
          <div className="rounded-lg border bg-gradient-to-r from-gray-50/50 to-slate-50/50 p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                <span className="w-3 h-3 bg-gray-500 rounded-full"></span>
                Minor Skills ({minorCount}/{MAX_MINORS})
              </h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {build.skills.minor.map(skillId => {
                const skill = skills.find(s => s.edid === skillId)
                if (!skill) return null

                return (
                  <div
                    key={skillId}
                    className="flex items-center gap-2 bg-gray-100 border border-gray-300 rounded-full px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors group"
                  >
                    <span>{skill.name}</span>
                    <button
                      onClick={() => handleSkillLevelChange(skill.edid, 'none')}
                      className="w-4 h-4 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center text-gray-700 hover:text-white transition-colors text-xs font-bold"
                      title="Remove skill"
                    >
                      ×
                    </button>
                  </div>
                )
              })}
              {build.skills.minor.length === 0 && (
                <p className="text-gray-500/70 text-sm italic">
                  No minor skills selected
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filtered Skills Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Available Skills ({fuzzyFilteredSkills.length} of {skills.length})
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 gap-4">
          {fuzzyFilteredSkills.map(skill => (
            <SkillCard
              key={skill.edid}
              skill={skill}
              skillLevel={getSkillLevel(skill.edid)}
              onSkillLevelChange={handleSkillLevelChange}
              compact={true}
              showCategory={false}
              majorCount={majorCount}
              minorCount={minorCount}
              maxMajors={MAX_MAJORS}
              maxMinors={MAX_MINORS}
            />
          ))}
        </div>

        {fuzzyFilteredSkills.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No skills found matching your criteria.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>
    </PlayerCreationLayout>
  )
}
