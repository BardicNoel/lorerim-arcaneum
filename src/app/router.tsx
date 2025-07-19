import { AccordionBirthsignsPage } from '@/features/birthsigns/pages/AccordionBirthsignsPage'
import { UnifiedDestinyPage } from '@/features/destiny'
import { AccordionRacesPage } from '@/features/races/pages/AccordionRacesPage'
import { AccordionReligionsPage } from '@/features/religions/pages/AccordionReligionsPage'
import { AccordionTraitsPage } from '@/features/traits/pages/AccordionTraitsPage'
import BuildPage from '@/pages/BuildPage'
import CraftingPage from '@/pages/CraftingPage'
import EquipmentPage from '@/pages/EquipmentPage'
import HomePage from '@/pages/HomePage'
import NotFoundPage from '@/pages/NotFoundPage'
import { SkillCardDemo } from '@/shared/components/ui/SkillCardDemo'
import { Route, Routes } from 'react-router-dom'

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/build" element={<BuildPage />} />
      <Route path="/race" element={<AccordionRacesPage />} />
      <Route path="/destiny" element={<UnifiedDestinyPage />} />
      <Route path="/birth-signs" element={<AccordionBirthsignsPage />} />
      <Route path="/traits" element={<AccordionTraitsPage />} />
      <Route path="/skills" element={<SkillCardDemo />} />
      <Route path="/religions" element={<AccordionReligionsPage />} />
      <Route path="/equipment" element={<EquipmentPage />} />
      <Route path="/crafting" element={<CraftingPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
