/* @flow */

import React, { createContext } from 'react'
import Tracker, { devTracker } from '../../Tracker'

export const TrackerContext: React$Context<Tracker> = createContext(devTracker)
export const TrackerProvider = TrackerContext.Provider

export default function withTracker<Config: { tracker: Tracker }>(
	Component: React$ComponentType<Config>
): React$ComponentType<$Diff<Config, { tracker: Tracker }>> {
	return function ConnectTracker(props: $Diff<Config, { tracker: Tracker }>) {
		return (
			<TrackerContext.Consumer>
				{(tracker: Tracker) => <Component {...props} tracker={tracker} />}
			</TrackerContext.Consumer>
		)
	}
}
