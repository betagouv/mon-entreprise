import { debounce } from './utils'

declare global {
    interface Window { _paq: any; }
}

function push(args: ['trackPageView']): void
function push(args: ['trackEvent']): void
function push(args: ['trackEvent', string, string]): void
function push(args: ['trackEvent', string, string, string]): void
function push(args: ['trackEvent', string, string, string, string, string]): void
function push(args: ['trackEvent', string, string, string, number]): void
function push() {}
type PushType = typeof push

export default class Tracker {
	push: PushType
	unlistenFromHistory: () => void
	previousPath: string

	constructor(pushFunction: PushType = args => window._paq.push(args)) {
		if (typeof window !== 'undefined') window._paq = window._paq || []
		this.push = debounce(200, pushFunction) as PushType
	}

	connectToHistory(history) {
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
	(console?.log?.bind(console)) ?? (() => {}) // eslint-disable-line no-console
)
