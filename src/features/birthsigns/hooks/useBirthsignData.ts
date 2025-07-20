import { useCallback, useEffect, useReducer } from 'react'
import type { Birthsign } from '../types'

interface BirthsignDataState {
  birthsigns: Birthsign[]
  loading: boolean
  error: string | null
}

type BirthsignDataAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Birthsign[] }
  | { type: 'FETCH_ERROR'; payload: string }

const initialState: BirthsignDataState = {
  birthsigns: [],
  loading: true,
  error: null,
}

function birthsignDataReducer(
  state: BirthsignDataState,
  action: BirthsignDataAction
): BirthsignDataState {
  switch (action.type) {
    case 'FETCH_START':
      return {
        ...state,
        loading: true,
        error: null,
      }
    case 'FETCH_SUCCESS':
      return {
        ...state,
        birthsigns: action.payload,
        loading: false,
        error: null,
      }
    case 'FETCH_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    default:
      return state
  }
}

export function useBirthsignData() {
  const [state, dispatch] = useReducer(birthsignDataReducer, initialState)

  const fetchBirthsigns = useCallback(async () => {
    dispatch({ type: 'FETCH_START' })
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}data/birthsigns.json`)
      if (!res.ok) throw new Error('Failed to fetch birthsign data')
      const data = await res.json()
      dispatch({ type: 'FETCH_SUCCESS', payload: data })
    } catch (err) {
      dispatch({
        type: 'FETCH_ERROR',
        payload: 'Failed to load birthsign data',
      })
    }
  }, [])

  useEffect(() => {
    fetchBirthsigns()
  }, [fetchBirthsigns])

  return { ...state, refetch: fetchBirthsigns }
}
