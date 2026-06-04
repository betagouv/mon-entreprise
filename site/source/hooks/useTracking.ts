import { useCallback } from 'react'

import { usePianoTracker } from '@/components/PianoAnalytics/PianoTrackerContext'
import { usePlausibleTracking } from '@/hooks/usePlausibleTracking'
import { getTrackingChapters, TrackingChapters, useTrackingChapters } from '@/components/PianoAnalytics/TrackingChaptersContext'
import { toAtString } from '@/components/PianoAnalytics'

type ClickTracking = {
	feature: string
	action: string
	simulateur?: string
}

type PageTracking = {
	name?: string
} & TrackingChapters

export function useTracking() {
	const pianoTracker = usePianoTracker()
	const plausibleTracker = usePlausibleTracking()
	const currentPianoChapters = useTrackingChapters()

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

	const trackPage = useCallback(
		({ name, ...chapters }: PageTracking) => {
			const { chapter1, chapter2, chapter3 } = getTrackingChapters(currentPianoChapters, chapters)

			pianoTracker?.sendEvent(
				'page.display',
				Object.fromEntries(
					Object.entries({
						page_chapter1: chapter1,
						page_chapter2: chapter2,
						page_chapter3: chapter3,
						page: name,
					}).map(([k, v]) => [k, v && toAtString(v)])
				)
			)
		},
		[currentPianoChapters, pianoTracker]
	)

	return { trackClick, trackPage }
}
