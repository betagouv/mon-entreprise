import './smarttag.js'

type CustomPageObject = {}
type CustomHitObject = {}

// Ci-dessous les indicateurs personnalisés de site et de page
// https://developers.atinternet-solutions.com/javascript-fr/contenus-javascript-fr/indicateurs-de-site-et-de-page-javascript-fr/
export const INDICATOR = {
	SITE: {
		LANGAGE: 1,
		EMBARQUÉ: 2,
	},
	PAGE: {},
} as const

type CustomSiteIndicator = {
	[INDICATOR.SITE.LANGAGE]: '[fr]' | '[en]' // langage du site (mycompanyinfrance ou mon-entreprise)
	[INDICATOR.SITE.EMBARQUÉ]: 1 | 0 // intégration externe
}
type CustomPageIndicator = {}

type ATHit = {
	name?: string
	chapter1?: string
	chapter2?: string
	chapter3?: string
	level2?: string
}

export interface ATTracker {
	page: {
		set(infos: ATHit): void
		send(infos: ATHit): void
	}
	click: {
		send(infos: ATHit): void
	}
	customVars: {
		set(variables: {
			site?: Partial<CustomSiteIndicator>
			page?: Partial<CustomPageIndicator>
		}): void
	}
	privacy: {
		setVisitorMode(authority: 'cnil', type: 'exempt'): void
		setVisitorOptout(): void
	}
	dispatch(): void
}

type ATTrackerClass = { new (options: { site: number }): ATTracker }

declare global {
	const ATInternet: {
		Tracker: { Tag: ATTrackerClass }
	}
}

export function createTracker(siteId?: string) {
	const site = siteId ? +siteId : 0
	if (Number.isNaN(site)) {
		throw new Error('expect string siteId to be of number form')
	}
	const BaseTracker: ATTrackerClass = siteId ? ATInternet.Tracker.Tag : Log
	class Tag extends BaseTracker {
		constructor(options: { language: 'fr' | 'en' }) {
			super({ site })
			this.privacy.setVisitorMode('cnil', 'exempt')
			if (
				process.env.NODE_ENV === 'production' &&
				(document.cookie
					.split(';')
					// We use Matomo cookie while it's here
					.find((cookie) => cookie.startsWith('mtm_consent_removed')) ||
					navigator.doNotTrack === '1')
			) {
				this.privacy.setVisitorOptout()
			}
			this.customVars.set({
				site: {
					[INDICATOR.SITE.LANGAGE]: `[${options.language}]` as '[fr]' | '[en]',
				},
			})
		}
	}
	return Tag
}

export class Log implements ATTracker {
	constructor(options?: Record<string, string | number>) {
		console.debug('ATTracker::new', options)
	}
	page = {
		set(infos: ATHit): void {
			console.debug('ATTracker::page.set', infos)
		},
		send(infos: ATHit): void {
			console.debug('ATTracker::page.send', infos)
		},
	}
	click = {
		send(infos: ATHit): void {
			console.debug('ATTracker::click.send', infos)
		},
	}
	customVars: ATTracker['customVars'] = {
		set(variables) {
			console.debug('ATTracker::customVars.set', variables)
		},
	}
	privacy: ATTracker['privacy'] = {
		setVisitorMode(...args) {
			console.debug('ATTracker::privacy.setVisitorMode', ...args)
		},
		setVisitorOptout() {
			console.debug('ATTracker::setVisitorOptout')
		},
	}
	dispatch(): void {
		console.debug('ATTracker::dispatch')
	}
}
