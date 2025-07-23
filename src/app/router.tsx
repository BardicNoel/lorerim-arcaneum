import { AccordionBirthsignsPage } from '@/features/birthsigns/pages/AccordionBirthsignsPage'
import { UnifiedDestinyPage } from '@/features/destiny'
import { UnifiedPerksPage } from '@/features/perks'
import { AccordionRacesPage } from '@/features/races/pages/AccordionRacesPage'
import { AccordionReligionsPage } from '@/features/religions/pages/AccordionReligionsPage'
import { UnifiedSkillsPage } from '@/features/skills'
import { AccordionTraitsPage } from '@/features/traits/pages/AccordionTraitsPage'
import { BuildPage } from '@/pages/BuildPage'
import CraftingPage from '@/pages/CraftingPage'
import EquipmentPage from '@/pages/EquipmentPage'
import { CharacterBuildLayout } from '@/shared/components/playerCreation'

import HomePage from '@/pages/HomePage'
import NotFoundPage from '@/pages/NotFoundPage'
import { Route, Routes } from 'react-router-dom'

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      {/* Character Build Flow - Nested Routes */}
      <Route path="/build" element={<CharacterBuildLayout />}>
        <Route index element={<BuildPage />} />
        <Route path="race" element={<AccordionRacesPage />} />
        <Route path="birth-signs" element={<AccordionBirthsignsPage />} />
        <Route path="traits" element={<AccordionTraitsPage />} />
        <Route path="religions" element={<AccordionReligionsPage />} />
        <Route path="destiny" element={<UnifiedDestinyPage />} />
        <Route path="perks" element={<UnifiedSkillsPage />} />
      </Route>

      {/* Legacy routes for backward compatibility */}
      <Route path="/race" element={<AccordionRacesPage />} />
      <Route path="/destiny" element={<UnifiedDestinyPage />} />
      <Route path="/perks" element={<UnifiedPerksPage />} />
      <Route path="/birth-signs" element={<AccordionBirthsignsPage />} />
      <Route path="/traits" element={<AccordionTraitsPage />} />
      <Route path="/religions" element={<AccordionReligionsPage />} />

      {/* Other pages */}
      <Route path="/perks" element={<UnifiedSkillsPage />} />
      <Route path="/equipment" element={<EquipmentPage />} />
      <Route path="/crafting" element={<CraftingPage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
