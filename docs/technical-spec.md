# 📘 Lorerim Arcaneum: Technical Design Specification

This document specifies the technical architecture and implementation details for initializing and building the **Lorerim Arcaneum** web app, a theorycrafting-focused application for Lorerim players.

---

## 🏗️ Project Overview

**Name:** Lorerim Arcaneum  
**Purpose:** Provide a theorycrafting playground and reference hub for Lorerim players.  
**Hosting:** GitHub Pages  
**Repository:** github.com/<your-org>/lorerim-arcaneum

---

## 📦 Tech Stack

| Layer              | Technology           |
| ------------------ | -------------------- |
| Frontend Framework | React (with Vite)    |
| Language           | TypeScript           |
| Styling            | TailwindCSS + custom |
| Search             | FUSE.js              |
| State Management   | Zustand              |
| Deployment         | GitHub Pages         |
| CI/CD              | GitHub Actions       |

---

## 🗂️ Folder Structure (Initial Scaffold)

```
lorerim-arcaneum/
├─ public/
│  ├─ data/
│  │   ├─ perks.json
│  │   ├─ races.json
│  │   ├─ traits.json
│  ├─ favicon.ico
├─ src/
│  ├─ features/
│  │   ├─ wishlist/
│  │   │   ├─ components/
│  │   │   ├─ store.ts          ← Zustand store
│  │   │   ├─ adapters.ts       ← JSON → UI data
│  │   │   ├─ hooks.ts
│  │   │   └─ routes/
│  │   ├─ playerCreation/
│  │   │   ├─ components/
│  │   │   ├─ store.ts          ← Optional, if filters needed
│  │   │   ├─ adapters.ts
│  │   │   └─ routes/
│  ├─ shared/
│  │   ├─ ui/
│  │   ├─ hooks/
│  │   ├─ utils/
│  │   ├─ context/
│  ├─ app/
│  │   ├─ router.tsx
│  │   ├─ App.tsx
│  ├─ main.tsx
├─ .github/
│  ├─ workflows/
│  │   ├─ deploy.yml
├─ .gitignore
├─ package.json
├─ tsconfig.json
├─ tailwind.config.ts
├─ vite.config.ts
```

---

## 🌐 Routing & Navigation

- **Router:** React Router with `HashRouter`
- **Base Path:** Configured for GitHub Pages subdirectory support
- **URL Encoding:** Filters and Wishlist state encoded in URL hash (Base64)

Example URL:  
`https://<user>.github.io/lorerim-arcaneum/#/player-creation/birthsigns#f13a2b`

---

## ⚙️ Data Flow

1. JSON data fetched from `/public/data`
2. Loaded into Zustand feature-local stores
3. Components consume state via custom hooks for rendering interactive UI
4. Wishlist and filters update store state and sync with URL hash

---

## 🧠 State Management Design

**Chosen Library:** Zustand

**Reasons for Zustand over Jotai or Redux:**

- ✅ Minimal API (1kb gzipped)
- ✅ Built-in persistence support (for future LocalStorage)
- ✅ Feature-local stores keep state scoped and modular
- ✅ Cursor agents can easily target per-feature state logic

**Pattern:**

- **Feature-local stores:** Each feature manages its own state (`wishlistStore`, `filtersStore`)
- **Custom hooks:** Encapsulate state access (`useWishlist()`, `useFilters()`, etc.)
- **MVP Persistence:** Session-only
- **Future:** Enable LocalStorage persistence for wishlist and planner

---

## 🎨 Frontend Code Structure Patterns

The app uses a hybrid of:

### ✅ Feature-Sliced Design (FSD)

- Organizes code by feature domain (PlayerCreation, Skills, Wishlist)
- Keeps components, stores, adapters, and routes grouped per feature
- Excellent for modular growth and Cursor-driven code generation

### ✅ Model-View-Adapter (MVA)

- **Model:** Raw JSON data loaded via feature store (Zustand)
- **Adapter:** Transforms data into view-ready format
- **View:** React components rendering the UI

**Component Sizing Principle:** Break components into reasonable sizes for clarity and reusability without adopting strict Atomic Design layers to reduce cognitive complexity.

---

## 📒 Wishlist Design (MVP)

- **Temporary State:** Session-only, managed in `wishlistStore`
- **Actions:** Add/Remove items, clear all, copy shareable link
- **URL Hash Encoding:** Wishlist encoded into Base64 hash for shareable links
- **Future Enhancements:** Persistence with LocalStorage, multi-build support

---

## 🎨 Styling & Theming

- Base: TailwindCSS
- Custom theme inspired by Skyrim UI
- Optional: ShadCN UI components for rapid development

---

## 🏗️ Deployment Pipeline

**GitHub Actions Workflow:**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repo
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "20"

      - name: Install dependencies
        run: npm ci

      - name: Build site
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

## 📌 Constraints

| Constraint                             | Notes                          |
| -------------------------------------- | ------------------------------ |
| Static app only (no backend)           | Fully served from GitHub Pages |
| JSON fetch relative to `/public/data/` | No external API calls          |
| Wishlist temporary for MVP             | Explore LocalStorage later     |
| HashRouter required                    | GitHub Pages compatibility     |
| Data size kept minimal                 | Fast page loads                |

---

## 🚀 Initialization Steps

1. Initialize Git repo and push to GitHub
2. Scaffold project with Vite + React + TypeScript
3. Add TailwindCSS and configure theme
4. Set up initial folder structure and placeholder JSON data
5. Configure GitHub Actions for deployment
6. Test deployment on GitHub Pages

---

## ⚓ Cursor IDE Directives

- Generate `projects/lorerim-arcaneum/design.mdc`
- Generate `projects/lorerim-arcaneum/features.mdc`
- Generate `projects/lorerim-arcaneum/requirements.mdc`
- Enforce JSON fetch paths relative to `/public/data/`
- Encode wishlist/filter state in URL hash (Base64)
- Use TailwindCSS + optional ShadCN for UI components

# Sidebar Navigation Specification

## Overview

The sidebar navigation provides access to all major sections of the Lorerim Arcaneum app. It is styled with the Skyrim theme and supports collapsible functionality.

## Structure

- **Header**: Logo, app title, subtitle, and collapse toggle
- **Navigation Sections**: Grouped by category (e.g., Character Creation, Game Systems, Tools)
- **Footer**: Version info and settings

## Navigation Items

- **No icons or emoji**: Navigation items are text-only. Do not use icons or emoji in the sidebar nav.
- **Left-aligned, tab offset**: All navigation items are left-aligned and indented (tab offset) under their section headers. Do not center nav items. Follow the submenu alignment and indentation style of ShadCN sidebar-03 ([see example](https://ui.shadcn.com/blocks)).
- **Section headers**: Use uppercase, small font, muted gold color.
- **Active state**: Highlight the active item with a gold background and border.
- **Hover state**: Use a subtle gold background on hover.

## Collapsible Behavior

- Sidebar can be collapsed to a narrow width, showing only the logo and collapse toggle.
- When collapsed, navigation items are hidden.

## Styling

- **Theme**: Skyrim dark background, gold accents, and muted gold for section headers.
- **Spacing**: Use padding and indentation to create a clear hierarchy.
- **Borders**: Gold borders for separation and active states.

## Implementation Note

- The sidebar follows the submenu alignment and indentation pattern of ShadCN sidebar-03 for a modern, accessible navigation experience.
