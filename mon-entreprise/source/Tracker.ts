import { History, Location } from 'history'
import { debounce, inIframe } from './utils'

declare global {
	interface Window {
		_paq: any
	}
}

type MatomoAction =
	| 'trackPageView'
	| 'trackEvent'
	| 'setReferrerUrl'
	| 'setCustomUrl'
type PushArgs = [MatomoAction, ...Array<string | number>]
type PushType = (args: PushArgs) => void

export default class Tracker {
	push: PushType
	debouncedPush: PushType
	unlistenFromHistory: (() => void) | undefined
	previousPath: string | undefined

	constructor(
		pushFunction: PushType = (args) => {
			window._paq.push(args)
		}
	) {
		if (typeof window !== 'undefined') window._paq = window._paq || []
		this.push = pushFunction
		this.debouncedPush = debounce(200, pushFunction)
	}

	connectToHistory(history: History) {
		this.unlistenFromHistory = history.listen((loc) => {
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
		if (this.previousPath) {
			this.push(['setReferrerUrl', this.previousPath])
		}
		this.push(['setCustomUrl', currentPath])
		// TODO: We should also call 'setDocumentTitle' but at this point the
		// document.title isn't updated yet.
		this.push(['trackPageView'])
		this.previousPath = currentPath
	}
}

export const devTracker = new Tracker(
	console?.debug?.bind(console) ?? (() => {}) // eslint-disable-line no-console
)
