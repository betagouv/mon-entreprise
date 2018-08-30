/* @flow */

import React, { Component, createContext } from 'react'
import type { ComponentType } from 'react'

export type Tracker = {
	push: (Array<string>) => void,
	connectToHistory: Function
}
export const defaultTracker: Tracker = {
	push: (console && console.log && console.log.bind(console)) || (() => {}), // eslint-disable-line no-console
	connectToHistory: history => history
}
const TrackerContext = createContext(defaultTracker)

export const TrackerProvider = TrackerContext.Provider
export default function withTracker<Props: { tracker: Tracker }>(
	WrappedComponent: ComponentType<Props>
) {
	class WithTracker extends Component<$Diff<Props, { tracker: Tracker }>> {
		displayName = `withTracker(${WrappedComponent.displayName || ''})`
		render() {
			return (
				<TrackerContext.Consumer>
					{tracker => <WrappedComponent {...this.props} tracker={tracker} />}
				</TrackerContext.Consumer>
			)
		}
	}
	return WithTracker
}
