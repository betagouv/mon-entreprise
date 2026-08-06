import React, { useEffect } from 'react'

import { usePianoTracker } from './PianoTrackerContext'
import {
	getTrackingChapters,
	TrackingChapters,
	useTrackingChapters,
} from './TrackingChaptersContext'

export function toAtString(string: string): string {
	string = string.replace(/ /g, '_').toLowerCase()
	string = string.replace(/[\xC0-\xC6]|[\xE0-\xE6]/g, 'a')
	string = string.replace(/[\xC8-\xCB]|[\xE8-\xEB]/g, 'e')
	string = string.replace(/[\xCC-\xCF]|[\xEC-\xEF]/g, 'i')
	string = string.replace(/[\xD2-\xD8]|[\xF2-\xF8]/g, 'o')
	string = string.replace(/[\xD9-\xDC]|[\xF9-\xFC]/g, 'u')
	string = string.replace(/[\xC7\xE7]/g, 'c')
	string = string.replace(/[\xD1\xF1]/g, 'n')
	string = string.replace(/[^\w]/gi, '_')

	return string
}

export const ACCUEIL = 'accueil'
export const SIMULATION_COMMENCEE = 'simulation_commencee'
export const SIMULATION_TERMINEE = 'simulation_terminee'

export function TrackPage({
	name,
	children,
	...chapters
}: {
	name?: string
	children?: React.ReactNode
} & TrackingChapters) {
	const tracker = usePianoTracker()
	const currentChapters = useTrackingChapters()
	const { chapter1, chapter2, chapter3 } = getTrackingChapters(
		currentChapters,
		chapters
	)

	useEffect(() => {
		tracker?.sendEvent(
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
	}, [tracker, name, chapter1, chapter2, chapter3])

	return <>{children}</>
}
