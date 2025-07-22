import { Outlet, useLocation } from 'react-router-dom'
import { CharacterFlowNav } from './CharacterFlowNav'

export const CharacterBuildLayout = () => {
  const location = useLocation()

  return (
    <div className="flex flex-col min-h-full">
      <CharacterFlowNav currentPath={location.pathname} />
      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  )
}
