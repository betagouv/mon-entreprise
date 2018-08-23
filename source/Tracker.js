export default class Piwik {
	constructor(opts) {
		const options = opts

		options.enableLinkTracking =
			options.enableLinkTracking !== undefined
				? options.enableLinkTracking
				: true
		options.trackDocumentTitle =
			options.trackDocumentTitle !== undefined
				? options.trackDocumentTitle
				: true

		this.options = options

		if (this.options.url === undefined || this.options.siteId === undefined) {
			throw new Error(
				'PiwikTracker cannot be initialized! SiteId and url are mandatory.'
			)
		}

		this.initPiwik()
	}

	initPiwik() {
		let url = this.options.url

		if (url.indexOf('http://') !== -1 || url.indexOf('https://') !== -1) {
			url = `${url}/`
		} else {
			url =
				document.location.protocol === 'https:'
					? `https://${url}/`
					: `http://${url}/`
		}

		window._paq = window._paq || [] // eslint-disable-line  no-underscore-dangle

		Piwik.push(['setSiteId', this.options.siteId])
		Piwik.push(['setTrackerUrl', `${url}piwik.php`])

		if (this.options.enableLinkTracking) {
			Piwik.push(['enableLinkTracking'])
		}

		const scriptElement = document.createElement('script')
		const refElement = document.getElementsByTagName('script')[0]

		scriptElement.type = 'text/javascript'
		scriptElement.defer = true
		scriptElement.async = true
		scriptElement.src = `${url}piwik.js`
		refElement.parentNode.insertBefore(scriptElement, refElement)

		return {
			push: this.push,
			track: this.track,
			connectToHistory: this.connectToHistory,
			disconnectFromHistory: this.disconnectFromHistory
		}
	}

	static push(args) {
		window._paq.push(args) // eslint-disable-line  no-underscore-dangle
	}

	push(args) {
		Piwik.push(args)
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

	track(loc) {
		const currentPath =
			loc.path || loc.pathname + loc.search /*.replace(/^\//, '')*/

		if (this.previousPath === currentPath) {
			return
		}

		if (this.options.trackDocumentTitle) {
			Piwik.push(['setDocumentTitle', document.title])
		}

		Piwik.push(['setCustomUrl', currentPath])
		Piwik.push(['trackPageView'])

		this.previousPath = currentPath
	}
}
