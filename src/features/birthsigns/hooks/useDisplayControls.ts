import { useCallback, useReducer } from 'react'

interface DisplayState {
  showStats: boolean
  showPowers: boolean
  showSkills: boolean
  showEffects: boolean
}

type DisplayAction =
  | { type: 'TOGGLE_STATS' }
  | { type: 'TOGGLE_POWERS' }
  | { type: 'TOGGLE_SKILLS' }
  | { type: 'TOGGLE_EFFECTS' }
  | { type: 'TOGGLE_ALL'; payload: boolean }

const initialState: DisplayState = {
  showStats: true,
  showPowers: true,
  showSkills: true,
  showEffects: true,
}

function displayReducer(
  state: DisplayState,
  action: DisplayAction
): DisplayState {
  switch (action.type) {
    case 'TOGGLE_STATS':
      return {
        ...state,
        showStats: !state.showStats,
      }

    case 'TOGGLE_POWERS':
      return {
        ...state,
        showPowers: !state.showPowers,
      }

    case 'TOGGLE_SKILLS':
      return {
        ...state,
        showSkills: !state.showSkills,
      }

    case 'TOGGLE_EFFECTS':
      return {
        ...state,
        showEffects: !state.showEffects,
      }

    case 'TOGGLE_ALL':
      return {
        ...state,
        showStats: action.payload,
        showPowers: action.payload,
        showSkills: action.payload,
        showEffects: action.payload,
      }

    default:
      return state
  }
}

export function useDisplayControls() {
  const [state, dispatch] = useReducer(displayReducer, initialState)

  const toggleStats = useCallback(() => {
    dispatch({ type: 'TOGGLE_STATS' })
  }, [])

  const togglePowers = useCallback(() => {
    dispatch({ type: 'TOGGLE_POWERS' })
  }, [])

  const toggleSkills = useCallback(() => {
    dispatch({ type: 'TOGGLE_SKILLS' })
  }, [])

  const toggleEffects = useCallback(() => {
    dispatch({ type: 'TOGGLE_EFFECTS' })
  }, [])

  const toggleAll = useCallback((enabled: boolean) => {
    dispatch({ type: 'TOGGLE_ALL', payload: enabled })
  }, [])

  return {
    ...state,
    toggleStats,
    togglePowers,
    toggleSkills,
    toggleEffects,
    toggleAll,
  }
}
