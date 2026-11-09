import Plausible from 'plausible-tracker'

import { environnement } from '@/services/environnement/environnement'
import * as safeLocalStorage from '@/storage/safeLocalStorage'

class PlausibleService {
	// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
	private plausible: ReturnType<typeof Plausible> | null = null
	private isTrackingDisabled = false

	initialize() {
		this.isTrackingDisabled =
			safeLocalStorage.getItem('tracking:do_not_track') === '1' ||
			navigator.doNotTrack === '1'

		if (this.plausible || this.isTrackingDisabled) return

		const { domaine, hôteApi, suivreLocalhost } =
			environnement.tracking.plausible

		this.plausible = Plausible({
			domain: domaine,
			apiHost: hôteApi,
			trackLocalhost: suivreLocalhost,
		})

		this.plausible.enableAutoPageviews()
		this.suivreLesClicsSurLesLiensSortants()
	}

	/**
	 * Remplace `enableAutoOutboundTracking` de plausible-tracker, qui annule le
	 * clic puis navigue dans la fenêtre courante : il ignore `target="_blank"`
	 * et, dans une iframe, ouvre le site externe dans l'iframe, ce que la
	 * plupart des sites refusent.
	 */
	private suivreLesClicsSurLesLiensSortants() {
		document.addEventListener(
			'click',
			(event) => {
				const lien =
					event.target instanceof Element
						? event.target.closest('a[href]')
						: null

				if (
					lien instanceof HTMLAnchorElement &&
					lien.host !== window.location.host
				) {
					this.track('Outbound Link: Click', { url: lien.href })
				}
			},
			// En phase de capture, car react-aria stoppe la propagation des clics
			{ capture: true }
		)
	}

	track(eventName: string, props?: Record<string, string | number>) {
		if (this.isTrackingDisabled || !this.plausible) return

		this.plausible.trackEvent(eventName, { props })
	}

	isReady() {
		return !!this.plausible && !this.isTrackingDisabled
	}

	isDisabled() {
		return this.isTrackingDisabled
	}
}

export const plausibleService = new PlausibleService()
