import Plausible from 'plausible-tracker'

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

		const domain: string =
			(import.meta.env.VITE_PLAUSIBLE_DOMAIN as string | undefined) ||
			(IS_PRODUCTION ? 'mon-entreprise.urssaf.fr' : 'dev.mon-entreprise.fr')
		const apiHost =
			(import.meta.env.VITE_PLAUSIBLE_API_HOST as string | undefined) ||
			'https://plausible.io'
		const trackLocalhost =
			import.meta.env.VITE_PLAUSIBLE_TRACK_LOCALHOST === 'true'

		this.plausible = Plausible({
			domain,
			apiHost,
			trackLocalhost,
		})

		this.plausible.enableAutoPageviews()
		this.plausible.enableAutoOutboundTracking()
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
