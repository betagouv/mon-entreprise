/* @flow */
import { debounce } from './utils'
import type { BrowserHistory } from 'history/createBrowserHistory'

type PushType = (
	| ['trackPageView']
	| ['trackEvent', string, string]
	| ['trackEvent', string, string, string]
	| ['trackEvent', string, string, string, number]
) => void

export default class Tracker {
	push: PushType
	unlistenFromHistory: () => void
	previousPath: string

	constructor(pushFunction: PushType = args => window._paq.push(args)) {
		if (typeof window !== 'undefined') window._paq = window._paq || []
		this.push = debounce(200, pushFunction)
	}

	connectToHistory(history: BrowserHistory) {
		this.unlistenFromHistory = history.listen(loc => {
			this.track(loc)
		})

		return history
	}

	disconnectFromHistory() {
		if (this.unlistenFromHistory) {
			this.unlistenFromHistory()

			return true
		}
		return false
	}

	track(loc: Location) {
		const currentPath = loc.pathname + loc.search

		if (this.previousPath === currentPath) {
			return
		}
		this.push(['trackPageView'])
		this.previousPath = currentPath
	}
}

export const devTracker = new Tracker(
	(console && console.log && console.log.bind(console)) || (() => {}) // eslint-disable-line no-console
)
