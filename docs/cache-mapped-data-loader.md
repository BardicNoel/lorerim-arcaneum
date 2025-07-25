# 📄 Cache-Mapped Data Loader System

## 🎯 Overview

The **Cache-Mapped Data Loader** is a singleton module-level cache system that provides efficient, type-safe access to JSON datasets. It eliminates the infinite loop issues and complexity of the previous Zustand-based system.

## 🏗️ Architecture

### Core Components

1. **`dataCache.ts`** - Singleton cache module
2. **`useDataCache.ts`** - React hooks for cache integration
3. **`DataCacheExample.tsx`** - Example usage component

### Key Features

✅ **Singleton Cache** - Data persists for app session lifetime  
✅ **Lazy Loading** - Only loads datasets when needed  
✅ **Type Safety** - Full TypeScript support with generic constraints  
✅ **No Infinite Loops** - Stable references prevent React issues  
✅ **Concurrent Loading** - Prevents duplicate requests for same dataset  
✅ **Error Handling** - Comprehensive error management  

## 📦 API Reference

### Core Functions

#### `loadDataset<K extends keyof DatasetMap>(name: K): Promise<DatasetMap[K]>`

Loads a dataset if not already cached.

```typescript
import { loadDataset } from '@/shared/data/dataCache'

// Load traits dataset
const traitsData = await loadDataset('traits')
console.log(traitsData.traits.length) // Array of traits
```

#### `getDataset<K extends keyof DatasetMap>(name: K): DatasetMap[K]`

Synchronously retrieves cached dataset (throws if not loaded).

```typescript
import { getDataset } from '@/shared/data/dataCache'

// Get cached traits (must be loaded first)
const traitsData = getDataset('traits')
```

#### `preloadDatasets<K extends keyof DatasetMap>(names: K[]): Promise<void>`

Preloads multiple datasets in parallel.

```typescript
import { preloadDatasets } from '@/shared/data/dataCache'

// Preload critical datasets
await preloadDatasets(['skills', 'races', 'traits'])
```

#### `clearCache(name?: keyof DatasetMap): void`

Clears cache for specific dataset or all datasets.

```typescript
import { clearCache } from '@/shared/data/dataCache'

clearCache('traits') // Clear specific dataset
clearCache() // Clear all datasets
```

#### `isCached<K extends keyof DatasetMap>(name: K): boolean`

Checks if dataset is cached.

```typescript
import { isCached } from '@/shared/data/dataCache'

if (isCached('traits')) {
  // Dataset is available
}
```

#### `isLoading<K extends keyof DatasetMap>(name: K): boolean`

Checks if dataset is currently loading.

```typescript
import { isLoading } from '@/shared/data/dataCache'

if (isLoading('traits')) {
  // Dataset is being loaded
}
```

### Convenience Functions

```typescript
// Loading functions
export const loadSkills = () => loadDataset('skills')
export const loadRaces = () => loadDataset('races')
export const loadTraits = () => loadDataset('traits')
export const loadReligions = () => loadDataset('religions')
export const loadBirthsigns = () => loadDataset('birthsigns')
export const loadDestinyNodes = () => loadDataset('destinyNodes')
export const loadPerkTrees = () => loadDataset('perkTrees')

// Getter functions
export const getSkills = () => getDataset('skills')
export const getRaces = () => getDataset('races')
export const getTraits = () => getDataset('traits')
export const getReligions = () => getDataset('religions')
export const getBirthsigns = () => getDataset('birthsigns')
export const getDestinyNodes = () => getDataset('destinyNodes')
export const getPerkTrees = () => getDataset('perkTrees')
```

## 🪝 React Hooks

### `useDataset<K extends keyof DatasetMap>(name: K)`

Hook for loading and accessing a dataset.

```typescript
import { useDataset } from '@/shared/data/useDataCache'

function MyComponent() {
  const { data, loading, error, reload } = useDataset('traits')
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  
  return (
    <div>
      {data.traits.map(trait => (
        <div key={trait.id}>{trait.name}</div>
      ))}
    </div>
  )
}
```

### `useDatasetSync<K extends keyof DatasetMap>(name: K)`

Hook for accessing pre-loaded datasets (throws if not loaded).

```typescript
import { useDatasetSync } from '@/shared/data/useDataCache'

function MyComponent() {
  // This will throw if traits aren't pre-loaded
  const traitsData = useDatasetSync('traits')
  
  return (
    <div>
      {traitsData.traits.map(trait => (
        <div key={trait.id}>{trait.name}</div>
      ))}
    </div>
  )
}
```

### Convenience Hooks

```typescript
// Async hooks (recommended)
export function useTraits() { return useDataset('traits') }
export function useSkills() { return useDataset('skills') }
export function useRaces() { return useDataset('races') }
export function useReligions() { return useDataset('religions') }
export function useBirthsigns() { return useDataset('birthsigns') }
export function useDestinyNodes() { return useDataset('destinyNodes') }
export function usePerkTrees() { return useDataset('perkTrees') }

// Sync hooks (for pre-loaded data)
export function useTraitsSync() { return useDatasetSync('traits') }
export function useSkillsSync() { return useDatasetSync('skills') }
export function useRacesSync() { return useDatasetSync('races') }
export function useReligionsSync() { return useDatasetSync('religions') }
export function useBirthsignsSync() { return useDatasetSync('birthsigns') }
export function useDestinyNodesSync() { return useDatasetSync('destinyNodes') }
export function usePerkTreesSync() { return useDatasetSync('perkTrees') }
```

## 🧑‍💻 Usage Examples

### Basic Component Usage

```typescript
import { useTraits } from '@/shared/data/useDataCache'

export function TraitsPage() {
  const { data, loading, error, reload } = useTraits()
  
  if (loading) {
    return <div>Loading traits...</div>
  }
  
  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={reload}>Retry</button>
      </div>
    )
  }
  
  return (
    <div>
      <h1>Traits ({data.traits.length})</h1>
      {data.traits.map(trait => (
        <div key={trait.id}>
          <h3>{trait.name}</h3>
          <p>{trait.description}</p>
        </div>
      ))}
    </div>
  )
}
```

### Preloading Critical Data

```typescript
import { useEffect } from 'react'
import { preloadDatasets } from '@/shared/data/dataCache'

export function App() {
  useEffect(() => {
    // Preload critical datasets on app start
    preloadDatasets(['skills', 'races', 'traits']).catch(console.error)
  }, [])
  
  return <YourApp />
}
```

### Manual Loading with Error Handling

```typescript
import { useState } from 'react'
import { loadDataset } from '@/shared/data/dataCache'

export function ManualLoader() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  
  const handleLoad = async () => {
    try {
      setError(null)
      const traitsData = await loadDataset('traits')
      setData(traitsData)
    } catch (err) {
      setError(err.message)
    }
  }
  
  return (
    <div>
      <button onClick={handleLoad}>Load Traits</button>
      {error && <p>Error: {error}</p>}
      {data && <p>Loaded {data.traits.length} traits</p>}
    </div>
  )
}
```

### Cache Status Monitoring

```typescript
import { isCached, isLoading } from '@/shared/data/dataCache'

export function CacheStatus() {
  return (
    <div>
      <p>Traits cached: {isCached('traits') ? 'Yes' : 'No'}</p>
      <p>Traits loading: {isLoading('traits') ? 'Yes' : 'No'}</p>
    </div>
  )
}
```

## 🔄 Migration from Zustand

### Before (Zustand - Problematic)

```typescript
// ❌ OLD - Infinite loop issues
import { useTraits } from '@/shared/data/DataProvider'

export function TraitsPage() {
  const { traits, loading, error, loadTraits } = useTraits()
  
  useEffect(() => {
    loadTraits() // This caused infinite loops!
  }, [loadTraits])
  
  // ... rest of component
}
```

### After (Cache System - Clean)

```typescript
// ✅ NEW - No infinite loops
import { useTraits } from '@/shared/data/useDataCache'

export function TraitsPage() {
  const { data, loading, error, reload } = useTraits()
  const traits = data?.traits || []
  
  // No useEffect needed - automatic loading!
  
  // ... rest of component
}
```

## 📊 Performance Benefits

| Aspect | Zustand System | Cache System |
|--------|----------------|--------------|
| **Memory Usage** | High (Zustand overhead) | Low (simple object cache) |
| **Re-renders** | Frequent (object recreation) | Minimal (stable references) |
| **Infinite Loops** | Common | Impossible |
| **Bundle Size** | Large (Zustand + middleware) | Small (simple functions) |
| **Type Safety** | Partial | Full |
| **Developer Experience** | Complex | Simple |

## 🚦 Error Handling

The system provides comprehensive error handling:

```typescript
// Network errors
try {
  const data = await loadDataset('traits')
} catch (error) {
  // Error: "Failed to load traits dataset: 404"
}

// Access errors
try {
  const data = getDataset('traits')
} catch (error) {
  // Error: 'Dataset "traits" not loaded. Call loadDataset("traits") first.'
}
```

## 🔧 Configuration

### Data Transformation

The system automatically transforms raw JSON data to match expected schemas:

```typescript
// Raw JSON structure
{
  "traits": [
    {
      "name": "Combat Master",
      "category": "Combat",
      "effects": [...]
    }
  ]
}

// Transformed structure
{
  "traits": [
    {
      "id": "combat-master", // Auto-generated
      "name": "Combat Master",
      "category": "Combat",
      "tags": ["Combat", "Master"], // Auto-generated
      "effects": [...]
    }
  ]
}
```

### File Structure

```
public/data/
├── skills.json
├── races.json
├── traits.json
├── religions.json
├── birthsigns.json
├── subclasses.json (destinyNodes)
└── perk-trees.json
```

## 🎯 Best Practices

1. **Use hooks for components** - `useTraits()`, `useSkills()`, etc.
2. **Preload critical data** - Use `preloadDatasets()` on app start
3. **Handle loading states** - Always check `loading` before rendering data
4. **Provide error recovery** - Use `reload()` function for retry logic
5. **Monitor cache status** - Use `isCached()` and `isLoading()` for debugging

## 🚀 Future Enhancements

- [ ] **Cache expiration** - Automatic cache invalidation
- [ ] **Background refresh** - Periodic data updates
- [ ] **Offline support** - Service worker integration
- [ ] **Data versioning** - Cache busting with version headers
- [ ] **Compression** - Gzip support for large datasets

---

This cache-mapped data loader provides a clean, efficient, and type-safe solution for managing JSON datasets in React applications. It eliminates the complexity and performance issues of state management libraries while providing a simple and intuitive API. 