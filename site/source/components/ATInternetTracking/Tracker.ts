// Ajoute la propriété 'pa' à Window pour que Typescript accepte window.pa
declare global {
	interface Window {
		pa: ATTracker
	}
}

type PageHit = {
	page?: string
	page_chapter1?: string
	page_chapter2?: string
	page_chapter3?: string
	simulateur_origine?: string
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
		privacyDefaultMode: 'optout' | 'exempt'
	}): void

	setProperties(
		propertiesObject: {
			env_language: 'fr' | 'en'
			'n:simulateur_embarque': 1 | 0
			simulateur_origine?: string
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
		setMode(type: 'exempt' | 'optout'): void
		getMode(): { name: 'exempt' | 'optout' }
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
				privacyDefaultMode: doNotTrack ? 'optout' : 'exempt',
			})

			const isEmbedded = document.location.pathname.includes('/iframes/')
			const integratorUrl = isEmbedded ? 
				decodeURIComponent(new URL(window.location.href).searchParams.get('integratorUrl') || '') :
				undefined

			const cleanIntegratorUrl = integratorUrl?.split('?')[0]

			window.pa.setProperties(
				{
					env_language: options.language,
					'n:simulateur_embarque': isEmbedded ? 1 : 0,
					simulateur_origine: cleanIntegratorUrl,
				},
				{ persistent: true }
			)
		}

		setConfigurations(options: {
			site: number
			collectDomain: string
			privacyDefaultMode: 'exempt'
		}): void {
			window.pa.setConfigurations(options)
		}

		setProperties(
			propertiesObject: {
				env_language: 'fr' | 'en'
				'n:simulateur_embarque': 1 | 0
				simulateur_origine?: string
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
				setMode(type: 'exempt' | 'optout'): void {
					window.pa.consent.setMode(type)
				},
				getMode(): { name: 'exempt' | 'optout' } {
					return window.pa.consent.getMode()
				},
			}
		}

		return PianoTracker
	}
