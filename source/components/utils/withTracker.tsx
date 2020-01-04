import { createContext } from 'react'
import Tracker, { devTracker } from '../../Tracker'

export const TrackerContext = createContext<Tracker>(devTracker)
export const TrackerProvider = TrackerContext.Provider
