
# 📖 SPEC: Perk Page (ShadCN Table)

---

## 🗂 Page Layout

```
+-----------------------------------------------------------+
| [Header / Breadcrumbs: "Perk Planner"]                   |
+-----------------------------------------------------------+
| [Skill Selector Tabs/Grid]                                |
+-----------------------------------------------------------+
| [Summary Sidebar]           | Perk Table (Selected Skill)|
|-----------------------------|-----------------------------|
| Totals:                     | Perk List:                 |
| - Perks selected            | [ ] Eagle Eye              |
| - Min level per skill       | [ ] Quick Shot             |
| - Reset/Clear options       | [ ] Bullseye               |
+-----------------------------+-----------------------------+
```

---

## 🎯 Core Components

### 1️⃣ Skill Selector
- **Purpose**: Select which skill’s perk list to view and edit.
- **UI**:
  - ShadCN `Tabs` or `Grid` of skill icons (desktop)
  - ShadCN `Combobox` (mobile fallback)
  - Badge showing selected perks per skill:
    ```
    [Archery (6)] [Smithing (3)] [Destruction (0)]
    ```
- **Interactions**:
  - Click tab/grid item switches the perk list to that skill.
  - Hover/tooltip shows min level for the skill.

---

### 2️⃣ Perk Table (ShadCN DataTable)
- **Purpose**: Display and manage all perks for the selected skill as a flat list.
- **Columns**:
| Column             | Type         | Notes                                           |
|--------------------|--------------|-------------------------------------------------|
| Select             | Checkbox     | Check/uncheck to add/remove perk from plan      |
| Name               | Text         | Perk name, clickable for details panel          |
| Rank               | Number/Input | Show current rank (e.g., 1/3) with +/– buttons  |
| Prerequisites      | Text/Tags    | List prerequisite perks, clickable references   |
| Level Requirement  | Number       | Base level requirement for the perk             |
| Actions            | Buttons      | "Add", "Remove", "Increment Rank"               |

- **Row Styling**:
  - **Selected perks**: Highlighted row (blue background)
  - **Unmet prerequisites**: Gray out row and show warning icon

- **Row Interaction**:
  - Toggle checkbox to select/unselect perk
  - Adjust rank for multi-rank perks with +/– buttons
  - Click prerequisite tags to scroll to those perks in the list

---

### 3️⃣ Summary Sidebar
- **Purpose**: Global overview of all selected perks and level requirements.
- **UI (ShadCN Panel)**:
  ```
  🏹 Archery
    - Selected Perks: 6
    - Min Level: 50
  ⚒ Smithing
    - Selected Perks: 3
    - Min Level: 30
  🔥 Total Perks: 15
  ```
- **Actions**:
  - Clear All (per skill or global)
  - Export Plan (JSON/shareable URL)

---

## 🔥 Feature Interactions

| Action                    | Result                                                |
|---------------------------|-------------------------------------------------------|
| Select skill tab          | Loads that skill’s perk list in the table            |
| Check a perk row          | Adds perk to plan                                    |
| Adjust ranks (+/–)        | Updates current rank of multi-rank perks             |
| Click prerequisite tag    | Scrolls to that perk in the table                    |
| Summary click (skill)     | Switches to that skill in the table                  |
| Clear/reset               | Removes all selected perks for the skill/all skills  |

---

## 📦 Data Model

### Perk Item
```ts
interface Perk {
  id: string; // Unique perk ID
  skill: string; // e.g., "Archery"
  name: string;
  description: string;
  levelRequirement: number;
  currentRank: number;
  maxRank: number;
  prerequisites: string[]; // IDs of required perks
  selected: boolean;
}
```

### Global State
```ts
interface PerkPlan {
  selectedPerks: Record<string, Perk[]>; // keyed by skill
  minLevels: Record<string, number>;     // skill -> min level
  totalPerks: number;
}
```

---

## 🛠 Technical Implementation

### Libraries
- **ShadCN UI**: DataTable, Tabs, Sidebar
- **Zustand/Jotai**: Global state for selected perks + level tracking
- **TailwindCSS**: Responsive design

---

### React Component Tree
```
<PerkPage>
  <SkillSelector />           // ShadCN Tabs/Grid
  <SummarySidebar />          // Selected perks + levels
  <PerkTable />               // ShadCN DataTable
</PerkPage>
```

---

## 🎨 Styling
- **Selected row:** Blue background, bold text
- **Available row:** Normal text, active checkbox
- **Locked row (prereqs unmet):** Gray background, disabled checkbox

---

## ✅ Pros
✔ Simple list-based UI, easy to navigate  
✔ Mobile-friendly out of the box  
✔ Filtering/searching perks is trivial  
✔ Minimal rendering performance concerns  

---

## ⚠️ Risks
✖ Less visual than React Flow (no constellation feel)  
✖ Long prerequisite chains might be harder to follow  
✖ Could feel less immersive for Skyrim fans  

---

## 🚀 MVP Scope
✅ Skill Selector (18 skills)  
✅ Perk Table per skill  
✅ Summary panel with running totals  
✅ Select/unselect perks and adjust ranks  
✅ Scroll-to-prerequisite feature
