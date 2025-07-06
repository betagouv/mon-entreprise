import { useEffect } from 'react'

import { plausibleService } from '@/services/plausibleService'

export function usePlausibleTracking() {
	useEffect(() => {
		plausibleService.initialize()
	}, [])

	return {
		track: plausibleService.track.bind(plausibleService),
		isReady: plausibleService.isReady(),
		isDisabled: plausibleService.isDisabled(),
	}
}
