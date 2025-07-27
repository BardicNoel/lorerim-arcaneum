# Lorerim Build Export Spec (Discord Formatting)

This document defines the export format used by the Lorerim character builder tool when sharing builds in **Discord**. The format is optimized for readability in chat, compact display, and internal hydration using placeholder tags.

---

## 📌 Export Format Template

```
**🛡️ Build: <buildName>**
*<notes>*

__🧬 Race:__ <raceName>  
__🌌 Birth Sign:__ <birthSignName> — <effects>  
__🧠 Traits:__  
<for each trait>
• **<traitName>** — <effects>  
<end>

__✝️ Religion:__ <religionName> — <effects>

__📚 Skills:__  
• **Major:** <skillName> <optional (Level N)>, ...  
• **Minor:** <skillName>, ...  
• **Other:** <skillName>, ...

__🎯 Perks:__  
<grouped by skill>
• **<skillName>:**  
  – **<perkName>** — <effects>  
<end>

#lorerim #<raceTag> #<themeTag1> #<themeTag2>
```

---

## 🔧 Placeholder Definitions

| Placeholder       | Description                                        |
| ----------------- | -------------------------------------------------- |
| `<buildName>`     | Character name or archetype                        |
| `<notes>`         | Optional flavor text or role description           |
| `<raceName>`      | Hydrated name of the selected race                 |
| `<birthSignName>` | Hydrated name of the chosen standing stone         |
| `<traitName>`     | Hydrated name of the trait                         |
| `<skillName>`     | Hydrated skill name; may include optional level    |
| `<perkName>`      | Hydrated name of the selected perk                 |
| `<effects>`       | Short description or summary of effect (1–2 lines) |
| `<#tags>`         | Discord hashtags for filtering/searching builds    |

---

## 🧩 Hydration Notes

The builder tool should internally hydrate placeholder tags like `<effects>`, `<traitName>`, `<skillName>`, and `<perkName>` before generating the final export. This ensures the Discord post is player-friendly without exposing raw keys.

### Example:

```json
{
  "traits": ["LoreTraits_BloodWarriorAb"]
}
```

Should hydrate to:

```
• **Blood Warrior** — Heal a small amount when killing enemies in melee.
```

---

## ✅ Formatting Guidelines

- Use `**bold**` for primary labels and names.
- Use `__underline__` for section headers.
- Use bullet points `•` and dashes `–` for nested lists.
- Avoid extra whitespace or line breaks.
- Avoid Markdown features unsupported in Discord (e.g., tables, collapsibles).

---

## 📋 Summary

This export format is compact, legible in Discord, and expandable through key hydration. All fields should be rendered by the application before export, maintaining consistent output for community sharing.

