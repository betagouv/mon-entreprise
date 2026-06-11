import { createContext, useContext } from 'react'

import { PianoTracker } from './PianoTracker'

export const PianoTrackerContext = createContext<PianoTracker | null>(null)

export function usePianoTracker(): PianoTracker | null {
	return useContext(PianoTrackerContext)
}
