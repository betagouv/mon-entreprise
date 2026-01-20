import './piano-analytics.js'

type ATTrackerClass = { new (options: { site: number }): ATTracker }

declare global {
	const ATInternet: {
		Tracker: { Tag: ATTrackerClass }
	}
}

// Ajoute la propriété 'pa' à Window pour que Typescript accepte window.pa
declare global {
	interface Window {
		pa: ATTracker
		pdl: {
			requireConsent: string
			consent: {
				defaultPreset: {
					PA: string
				}
				products?: string[]
			}
		}
	}
}

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
	evenement_type?: 'telechargement'
}

export interface ATTracker {
	setConfigurations(options: {
		site: number
		collectDomain: string
		privacyDefaultMode: 'opt-out' | 'essential'
	}): void

	setProperties(
		propertiesObject: {
			env_language: 'fr' | 'en'
			'n:simulateur_embarque': 1 | 0
		},
		options: {
			persistent: true
		}
	): void

	sendEvent(type: 'page.display', data: PageHit): void
	sendEvent(
		type:
			| 'demarche.document'
			| 'click.action'
			| 'click.navigation'
			| 'click.download'
			| 'click.exit',
		data: ClickHit & PageHit
	): void

	consent: {
		setMode(type: 'opt-out' | 'essential'): void
		getMode(): { name: 'opt-out' | 'essential' }
	}
}

export function createTracker(siteId?: string, doNotTrack = false) {
	const site = siteId ? +siteId : 0
	if (Number.isNaN(site)) {
		throw new Error('Expect string siteId to be of number form')
	}

	if (typeof window === 'undefined' || !window.pa) {
		throw new Error('Piano Analytics script not loaded')
	}

	class PianoTracker implements ATTracker {
		constructor(options: { language: 'fr' | 'en' }) {
			window.pa.setConfigurations({
				site,
				collectDomain: 'https://tm.urssaf.fr',
				privacyDefaultMode: doNotTrack ? 'opt-out' : 'essential',
			})

			window.pa.setProperties(
				{
					env_language: options.language,
					'n:simulateur_embarque': document.location.pathname.includes(
						'/iframes/'
					)
						? 1
						: 0,
				},
				{ persistent: true }
			)
		}

		setConfigurations(options: {
			site: number
			collectDomain: string
			privacyDefaultMode: 'essential'
		}): void {
			window.pa.setConfigurations(options)
		}

		setProperties(
			propertiesObject: {
				env_language: 'fr' | 'en'
				'n:simulateur_embarque': 1 | 0
			},
			options: { persistent: true }
		): void {
			window.pa.setProperties(propertiesObject, options)
		}

		sendEvent(
			type:
				| 'page.display'
				| 'demarche.document'
				| 'click.action'
				| 'click.navigation'
				| 'click.download'
				| 'click.exit',
			data: PageHit | (ClickHit & PageHit)
		): void {
			if (type === 'page.display') {
				window.pa.sendEvent(type, data as PageHit)
			} else {
				window.pa.sendEvent(type, data as ClickHit & PageHit)
			}
		}

		consent = {
			setMode(type: 'essential' | 'opt-out'): void {
				window.pa.consent.setMode(type)
			},
			getMode(): { name: 'essential' | 'opt-out' } {
				return window.pa.consent.getMode()
			},
		}
	}

	return PianoTracker
}
