import { History, Location } from 'history'
import { debounce, inIframe } from './utils'

declare global {
	interface Window {
		_paq: any
	}
}

type TrackingAction = 'trackPageView' | 'trackEvent' | 'disableCookies'

type PushArgs = [TrackingAction, ...Array<string | number>]
type PushType = (args: PushArgs) => void

const ua = window.navigator.userAgent
const iOSSafari =
	(!!ua.match(/iPad/i) || !!ua.match(/iPhone/i)) &&
	!!ua.match(/WebKit/i) &&
	!ua.match(/CriOS/i)

export default class Tracker {
	push: PushType
	unlistenFromHistory: (() => void) | undefined
	previousPath: string | undefined

	constructor(
		pushFunction: PushType = args => (window?._paq ?? []).push(args)
	) {
		this.push = debounce(200, pushFunction) as PushType
		// There is an issue with the way Safari handle cookies in iframe, cf.
		// https://gist.github.com/iansltx/18caf551baaa60b79206.
		// TODO : We don't need to disable cookies if a cookie is already set
		if (iOSSafari && inIframe) {
			pushFunction(['disableCookies'])
		}
		pushFunction(['trackPageView'])
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
