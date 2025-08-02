interface DummyItem {
  id: string
  title: string
  description: string
  height: number
  color: string
  tags: string[]
}

const colors = [
  'bg-red-100 border-red-300',
  'bg-blue-100 border-blue-300',
  'bg-green-100 border-green-300',
  'bg-yellow-100 border-yellow-300',
  'bg-purple-100 border-purple-300',
  'bg-pink-100 border-pink-300',
  'bg-indigo-100 border-indigo-300',
  'bg-gray-100 border-gray-300',
]

const titles = [
  'Mystical Artifact',
  'Ancient Scroll',
  'Enchanted Weapon',
  'Potion of Power',
  'Crystal Shard',
  'Runic Tablet',
  'Magical Tome',
  'Arcane Relic',
  'Divine Essence',
  'Ethereal Fragment',
]

const descriptions = [
  'A powerful artifact imbued with ancient magic.',
  'Scroll containing forgotten spells and rituals.',
  'Weapon blessed by the gods themselves.',
  'Brew that grants temporary supernatural abilities.',
  'Crystal that resonates with magical energy.',
  'Tablet inscribed with mysterious runes.',
  'Book of forbidden knowledge and power.',
  'Relic from a bygone era of magic.',
  'Essence of divine power and wisdom.',
  'Fragment of pure ethereal energy.',
]

const tags = [
  'magic',
  'ancient',
  'powerful',
  'rare',
  'legendary',
  'enchanted',
  'divine',
  'mystical',
  'forbidden',
  'sacred',
]

export function generateDummyItems(count: number): DummyItem[] {
  const items: DummyItem[] = []

  for (let i = 0; i < count; i++) {
    const id = `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const height = Math.floor(Math.random() * 200) + 100 // 100-300px
    const color = colors[Math.floor(Math.random() * colors.length)]
    const title = titles[Math.floor(Math.random() * titles.length)]
    const description =
      descriptions[Math.floor(Math.random() * descriptions.length)]

    // Generate 1-3 random tags
    const itemTags = []
    const numTags = Math.floor(Math.random() * 3) + 1
    const shuffledTags = [...tags].sort(() => 0.5 - Math.random())
    itemTags.push(...shuffledTags.slice(0, numTags))

    items.push({
      id,
      title,
      description,
      height,
      color,
      tags: itemTags,
    })
  }

  return items
}
