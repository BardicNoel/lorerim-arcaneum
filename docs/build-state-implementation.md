# 🏹 Build State Implementation

This document describes the URL-synced character build state implementation for the Lorerim Arcaneum application.

## 📋 Overview

The build state system allows users to create and share character builds through URL encoding. The entire character build state is automatically synced to the URL, making it easy to share builds with others.

## 🏗️ Architecture

### Core Components

1. **Build State Types** (`src/shared/types/build.ts`)
   - Defines the `BuildState` interface
   - Contains default build state

2. **Zustand Store** (`src/shared/stores/characterStore.ts`)
   - Manages global build state
   - Provides actions for updating build

3. **URL Sync Hook** (`src/shared/hooks/useURLSync.ts`)
   - Handles URL encoding/decoding
   - Syncs state changes to URL
   - Hydrates state from URL on load

4. **Convenience Hook** (`src/shared/hooks/useCharacterBuild.ts`)
   - Provides easy-to-use methods for build management
   - Includes validation and utility functions

## 🔧 Usage

### Basic Usage

```tsx
import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'

function MyComponent() {
  const { build, setName, setRace, addTrait } = useCharacterBuild()
  
  return (
    <div>
      <input 
        value={build.name} 
        onChange={(e) => setName(e.target.value)} 
      />
      <button onClick={() => setRace('nord')}>
        Set Race to Nord
      </button>
      <button onClick={() => addTrait('warrior')}>
        Add Warrior Trait
      </button>
    </div>
  )
}
```

### URL Sharing

The build state is automatically encoded in the URL. Users can:

1. **Share URLs**: Copy the URL and share it with others
2. **Bookmark builds**: Save URLs to return to specific builds later
3. **Compare builds**: Open multiple tabs with different builds

Example URL:
```
https://yourbuilder.github.io/#/build?b=eyJ2IjoxLCJuYW1lIjoiQXJkZW50aWEiLCJyYWNlIjoibm9yZCJ9
```

## 📊 Build State Schema

```ts
interface BuildState {
  v: number;           // Schema version (for future migrations)
  name: string;        // Character name
  notes: string;       // RP flavor text
  race: string | null; // Race EDID
  stone: string | null; // Birth sign EDID
  religion: string | null; // Religion EDID
  traits: string[];    // Array of trait EDIDs
  skills: {
    major: string[];   // Array of major skill EDIDs
    minor: string[];   // Array of minor skill EDIDs
  };
  equipment: string[]; // Array of equipment EDIDs
}
```

## 🎯 Features

### ✅ Implemented

- [x] URL-synced build state
- [x] Base64 URL-safe encoding
- [x] Automatic state hydration from URL
- [x] Build validation
- [x] Convenience methods for common operations
- [x] Build status display component
- [x] Integration with existing navigation

### 🚧 Future Enhancements

- [ ] Data lookup to resolve EDIDs to full records
- [ ] Build comparison tools
- [ ] Build templates/presets
- [ ] Export/import functionality
- [ ] Build versioning and history

## 🔗 Integration Points

### App Integration

The URL sync is initialized in `src/app/App.tsx`:

```tsx
function App() {
  useURLSync() // Initialize URL sync
  // ... rest of app
}
```

### Navigation

The build page is accessible via:
- Navigation menu: "Character Builder"
- Direct URL: `/#/build`
- Programmatic navigation: `navigate('/build')`

### Components

- `BuildPage`: Full character builder interface
- `BuildStatus`: Compact build status display
- Can be integrated into any existing page

## 🛠️ Development

### Adding New Build Fields

1. Update `BuildState` interface in `src/shared/types/build.ts`
2. Add to `DEFAULT_BUILD` constant
3. Add convenience methods to `useCharacterBuild` hook
4. Update UI components as needed

### Testing URL Sync

1. Navigate to `/build`
2. Make changes to the build
3. Copy the URL
4. Open in new tab/incognito window
5. Verify state is restored correctly

## 🐛 Troubleshooting

### Common Issues

1. **URL too long**: Consider compressing data or splitting into multiple parameters
2. **Invalid state**: Check schema version and validation
3. **Encoding errors**: Verify base64 encoding/decoding functions

### Debug Tools

- Build state is displayed in JSON format on the build page
- Browser dev tools can inspect URL parameters
- Console warnings for invalid schemas

## 📝 Notes

- Uses `window.history.replaceState` to avoid polluting browser history
- Schema versioning allows for future migrations
- All EDIDs are stored as strings for flexibility
- URL encoding is URL-safe (no `+`, `/`, or `=` characters) 