/* eslint-disable no-console */
import './smarttag.js'

// Ci-dessous les indicateurs personnalisés de site et de page
// https://developers.atinternet-solutions.com/javascript-fr/contenus-javascript-fr/indicateurs-de-site-et-de-page-javascript-fr/
export const INDICATOR = {
	SITE: {
		LANGAGE: 1,
		EMBARQUÉ: 2,
	},
	PAGE: {},
} as const

type PageHit = {
	page?: string
	page_chapter1?: string
	page_chapter2?: string
	page_chapter3?: string
}

type ClickHit = {
	click?: string
	click_chapter1?: string
	click_chapter2?: string
	click_chapter3?: string
}

export interface ATTracker {
	setProp(prop: 'env_language', value: 'fr' | 'en', persistant: true): void
	setProp(prop: 'n:simulateur_embarque', value: 1 | 0, persistant: true): void
	setProp(
		prop: 'evenement_type',
		value: 'telechargement',
		persistant: false
	): void

	events: {
		send(type: 'page.display', data: PageHit): void
		send(
			type:
				| 'demarche.document'
				| 'click.action'
				| 'click.navigation'
				| 'click.download'
				| 'click.exit',
			data: ClickHit & PageHit
		): void
	}

	privacy: {
		setVisitorMode(authority: 'cnil', type: 'exempt'): void
		setVisitorOptout(): void
		getVisitorMode(): { name: 'exempt' | 'optout' }
	}
}

type ATTrackerClass = { new (options: { site: number }): ATTracker }

declare global {
	const ATInternet: {
		Tracker: { Tag: ATTrackerClass }
	}
}

export function createTracker(siteId?: string, doNotTrack = false) {
	const site = siteId ? +siteId : 0
	if (Number.isNaN(site)) {
		throw new Error('expect string siteId to be of number form')
	}
	const BaseTracker: ATTrackerClass =
		siteId && !import.meta.env.SSR ? ATInternet?.Tracker.Tag : Log

	class Tag extends BaseTracker implements ATTracker {
		#send: ATTracker['events']['send']

		constructor(options: { language: 'fr' | 'en' }) {
			super({ site })
			this.#send = this.events.send.bind(this)
			this.events.send = (type, data) => {
				if (type === 'page.display') {
					this.#currentPageInfo = data
					this.#send(type, data)

					return
				}
				if (!('click' in data)) {
					throw new Error('invalid argument error')
				}
				this.#send(type, { ...this.#currentPageInfo, ...data })
			}

			this.setProp('env_language', options.language, true)
			this.setProp(
				'n:simulateur_embarque',
				document.location.pathname.includes('/iframes/') ? 1 : 0,
				true
			)

			if (import.meta.env.MODE === 'production' && doNotTrack) {
				this.privacy.setVisitorOptout()
			} else {
				this.privacy.setVisitorMode('cnil', 'exempt')
			}
		}

		#currentPageInfo: PageHit = {}
	}

	return Tag
}

export class Log implements ATTracker {
	constructor(options?: Record<string, string | number>) {
		console.debug('ATTracker::new', options)
	}

	setProp(name: string, value: unknown, persistent: boolean): void {
		console.debug('ATTracker::setProp', { name, value, persistent })
	}

	events = {
		send(name: string, data: Record<string, unknown>): void {
			console.debug('ATTracker::events.send', name, data)
		},
	}

	privacy: ATTracker['privacy'] = {
		setVisitorMode(...args) {
			console.debug('ATTracker::privacy.setVisitorMode', ...args)
		},
		setVisitorOptout() {
			console.debug('ATTracker::setVisitorOptout')
		},
		getVisitorMode() {
			console.debug('ATTracker::privacy.getVisitorMode')

			return { name: 'exempt' }
		},
	}

	dispatch(): void {
		console.debug('ATTracker::dispatch')
	}
}
