export interface AvatarMapping {
  [entityName: string]: string
}

export interface EntityAvatarConfig {
  [entityType: string]: AvatarMapping
}

export const entityAvatarMaps: EntityAvatarConfig = {
  race: {
    Altmer: 'altmer.png',
    Argonian: 'argonian.png',
    Bosmer: 'bosmer.png',
    Breton: 'breton.png',
    Dunmer: 'dunmer.png',
    Imperial: 'imperial.png',
    Khajiit: 'khajit.png',
    Nord: 'nord.png',
    Orsimer: 'orismer.png',
    Redguard: 'redguard.png',
  },
  religion: {
    // Add religion avatars as they become available
  },
  trait: {
    // Add trait avatars as they become available
  },
  destiny: {
    // Add destiny avatars as they become available
  },
  birthsign: {
    Apprentice: 'apprentice.svg',
    // Add more birthsign avatars as they become available
  },
}

export function getAvatarFileName(
  entityType: string,
  entityName: string
): string | undefined {
  return entityAvatarMaps[entityType]?.[entityName]
}

export function addAvatarMapping(
  entityType: string,
  entityName: string,
  fileName: string
): void {
  if (!entityAvatarMaps[entityType]) {
    entityAvatarMaps[entityType] = {}
  }
  entityAvatarMaps[entityType][entityName] = fileName
}
