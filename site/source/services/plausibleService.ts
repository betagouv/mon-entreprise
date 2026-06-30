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
