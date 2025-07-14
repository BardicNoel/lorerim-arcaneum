# 🎯 Z-Index System - Unified Layering Constants

## Overview

This document defines the unified z-index system used throughout the Lorerim Arcaneum application. All z-index values are centralized in `src/lib/constants.ts` to ensure consistent layering and prevent conflicts.

## 🏗️ Z-Index Hierarchy

### Base Layers (0-20)
```typescript
BASE: 0        // Base content layer
CONTENT: 1     // Page content
CARD: 2        // Card components
BUTTON: 10     // Interactive buttons
INPUT: 20      // Form inputs
```

### Sticky Elements (40)
```typescript
STICKY: 40     // Sticky positioned elements (detail panels, etc.)
```

### Navigation (50-70)
```typescript
HEADER: 50     // Site header
SIDEBAR: 60    // Sidebar navigation
NAVIGATION: 70 // Top navigation elements
```

### Dropdowns & Overlays (100-200)
```typescript
DROPDOWN: 100      // Basic dropdowns
AUTOCOMPLETE: 120  // Autocomplete search dropdowns
TOOLTIP: 150       // Tooltips
MODAL: 200         // Modal dialogs
```

### Notifications (300-350)
```typescript
NOTIFICATION: 300  // Notification banners
TOAST: 350         // Toast notifications
```

### Maximum (999)
```typescript
MAX: 999           // Critical overlays (use sparingly)
```

## 🔧 Usage

### Import the Constants
```typescript
import { Z_INDEX } from '@/lib/constants'
```

### Apply Z-Index
```typescript
// Using inline styles (preferred for dynamic z-index)
<div style={{ zIndex: Z_INDEX.AUTOCOMPLETE }}>
  Autocomplete dropdown
</div>

// Using Tailwind classes (for static z-index)
<div className="z-50"> // z-50 = Z_INDEX.HEADER
  Header content
</div>
```

## 🎯 Component-Specific Guidelines

### SiteHeader
- **Z-Index**: `Z_INDEX.NAVIGATION` (70)
- **Reason**: Must appear above all content but below modals

### Sidebar
- **Z-Index**: `Z_INDEX.SIDEBAR` (60)
- **Reason**: Appears above content but below header

### Autocomplete Dropdowns
- **Z-Index**: `Z_INDEX.AUTOCOMPLETE` (120)
- **Reason**: Must appear above page content and navigation

### Sticky Detail Panels
- **Z-Index**: `Z_INDEX.STICKY` (40)
- **Reason**: Appears above content but below navigation

### Modals
- **Z-Index**: `Z_INDEX.MODAL` (200)
- **Reason**: Must appear above everything except critical overlays

## 🚨 Common Issues & Solutions

### Problem: Dropdown appears behind other elements
**Solution**: Use `Z_INDEX.AUTOCOMPLETE` (120) for autocomplete dropdowns

### Problem: Sticky header overlaps content
**Solution**: Ensure header uses `Z_INDEX.NAVIGATION` (70) and content uses lower values

### Problem: Sidebar appears behind page content
**Solution**: Use `Z_INDEX.SIDEBAR` (60) for sidebar positioning

## 📋 Best Practices

1. **Always use constants**: Never hardcode z-index values
2. **Test layering**: Verify z-index hierarchy works across all screen sizes
3. **Document exceptions**: If you need a custom z-index, document why
4. **Keep it simple**: Use the lowest z-index that works for your use case
5. **Consider mobile**: Ensure z-index works on mobile devices

## 🔄 Migration Guide

### Before (Hardcoded Values)
```typescript
<div className="z-50">Header</div>
<div className="z-100">Dropdown</div>
<div className="z-40">Sidebar</div>
```

### After (Using Constants)
```typescript
<div style={{ zIndex: Z_INDEX.NAVIGATION }}>Header</div>
<div style={{ zIndex: Z_INDEX.AUTOCOMPLETE }}>Dropdown</div>
<div style={{ zIndex: Z_INDEX.SIDEBAR }}>Sidebar</div>
```

## 🎯 Testing Checklist

- [ ] Header appears above all content
- [ ] Autocomplete dropdowns appear above page content
- [ ] Sidebar appears above content but below header
- [ ] Sticky elements work correctly
- [ ] Modals appear above everything
- [ ] Mobile layering works properly
- [ ] No z-index conflicts between components 