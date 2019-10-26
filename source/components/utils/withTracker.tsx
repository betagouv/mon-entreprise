import React, { createContext } from 'react'
import Tracker, { devTracker } from '../../Tracker'

export const TrackerContext = createContext(devTracker)
export const TrackerProvider = TrackerContext.Provider

export interface WithTrackerProps {
	tracker: Tracker
}

export default function withTracker(Component: React.ComponentType) {
	return function ConnectTracker(props) {
		return (
			<TrackerContext.Consumer>
				{(tracker: Tracker) => <Component {...props} tracker={tracker} />}
			</TrackerContext.Consumer>
		)
	}
}
