import { Routes, Route } from 'react-router-dom'
import { AccordionBirthsignsPage } from '@/features/birthsigns/pages/AccordionBirthsignsPage'
import TraitsPage from '@/pages/TraitsPage'
import EquipmentPage from '@/pages/EquipmentPage'
import CraftingPage from '@/pages/CraftingPage'
import SkillsPage from '@/pages/SkillsPage'
import HomePage from '@/pages/HomePage'
import NotFoundPage from '@/pages/NotFoundPage'
import { AccordionRacesPage } from '@/features/races/pages/AccordionRacesPage'
import { AccordionReligionsPage } from '@/features/religions/pages/AccordionReligionsPage'
import { UnifiedDestinyPage } from '@/features/destiny'

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/race" element={<AccordionRacesPage />} />
      <Route path="/destiny" element={<UnifiedDestinyPage />} />
      <Route path="/birth-signs" element={<AccordionBirthsignsPage />} />
      <Route path="/traits" element={<TraitsPage />} />
      <Route path="/skills" element={<SkillsPage />} />
      <Route path="/religions" element={<AccordionReligionsPage />} />
      <Route path="/equipment" element={<EquipmentPage />} />
      <Route path="/crafting" element={<CraftingPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
} 