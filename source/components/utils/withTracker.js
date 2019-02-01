/* @flow */

import React, { createContext } from 'react'

export type Tracker = {
	push: (
		| ['trackEvent', string, string]
		| ['trackEvent', string, string, string]
		| ['trackEvent', string, string, string, number]
	) => void,
	connectToHistory: Function
}
export const defaultTracker: Tracker = {
	push: (console && console.log && console.log.bind(console)) || (() => {}), // eslint-disable-line no-console
	connectToHistory: history => history
}
const TrackerContext: React$Context<Tracker> = createContext(defaultTracker)
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
