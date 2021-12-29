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

type CustomSiteIndicator = {
	[INDICATOR.SITE.LANGAGE]: '[fr]' | '[en]' // langage du site (mycompanyinfrance ou mon-entreprise)
	[INDICATOR.SITE.EMBARQUÉ]: '1' | '0' // intégration externe
}
type CustomPageIndicator = Record<string, string>
type CustomVars = {
	site?: Partial<CustomSiteIndicator>
	page?: Partial<CustomPageIndicator>
}
type ATHit = {
	name?: string
	chapter1?: string
	chapter2?: string
	chapter3?: string
	level2?: string
	customVars?: CustomVars
}

export interface ATTracker {
	page: {
		set(infos: ATHit): void
	}
	click: {
		set(
			infos: ATHit & { type: 'exit' | 'download' | 'action' | 'navigation' }
		): void
	}
	customVars: {
		set(variables: CustomVars): void
	}
	privacy: {
		setVisitorMode(authority: 'cnil', type: 'exempt'): void
		setVisitorOptout(): void
		getVisitorMode(): { name: 'exempt' | 'optout' }
	}
	dispatch(): void
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
	const BaseTracker: ATTrackerClass = siteId ? ATInternet?.Tracker.Tag : Log
	class Tag extends BaseTracker {
		site: CustomSiteIndicator = {
			[INDICATOR.SITE.LANGAGE]: '[fr]',
			[INDICATOR.SITE.EMBARQUÉ]:
				!import.meta.env.SSR && document.location.pathname.includes('/iframes/')
					? '1'
					: '0',
		}
		constructor(options: { language: 'fr' | 'en' }) {
			super({ site })
			this.site[INDICATOR.SITE.LANGAGE] = `[${options.language}]`
			if (import.meta.env.MODE === 'production' && doNotTrack) {
				this.privacy.setVisitorOptout()
			} else {
				this.privacy.setVisitorMode('cnil', 'exempt')
			}
		}

		dispatch() {
			this.customVars.set({ site: this.site })
			super.dispatch()
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
	}
	click = {
		set(infos: ATHit): void {
			console.debug('ATTracker::click.set', infos)
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
		getVisitorMode() {
			console.debug('ATTracker::privacy.getVisitorMode')
			return { name: 'exempt' }
		},
	}
	dispatch(): void {
		console.debug('ATTracker::dispatch')
	}
}
