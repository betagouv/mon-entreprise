import { History, Location } from 'history'
import { debounce } from './utils'

declare global {
	interface Window {
		_paq: any
	}
}

type PushArgs = ['trackPageView'] | ['trackEvent', ...Array<string | number>]
type PushType = (args: PushArgs) => void

export default class Tracker {
	push: PushType
	unlistenFromHistory: () => void
	previousPath: string

	constructor(pushFunction: PushType = args => window._paq.push(args)) {
		if (typeof window !== 'undefined') window._paq = window._paq || []
		this.push = debounce(200, pushFunction) as PushType
	}

	connectToHistory(history: History) {
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
	console?.debug?.bind(console) ?? (() => {}) // eslint-disable-line no-console
)
