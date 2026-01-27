import { useCallback } from 'react'

import { usePianoTracking } from '@/components/ATInternetTracking'
import { usePlausibleTracking } from '@/hooks/usePlausibleTracking'

export type ClickTracking = {
	feature: string
	action: string
	simulateur?: string
}

export function useTracking() {
	const pianoTracker = usePianoTracking()
	const plausibleTracker = usePlausibleTracking()

	const trackClick = useCallback(
		({ feature, action, simulateur }: ClickTracking) => {
			pianoTracker?.sendEvent('click.action', {
				click_chapter1: feature,
				click: action,
			})
			plausibleTracker.track('click', {
				feature,
				action,
				...(simulateur && { simulateur }),
			})
		},
		[pianoTracker, plausibleTracker]
	)

	return { trackClick }
}
