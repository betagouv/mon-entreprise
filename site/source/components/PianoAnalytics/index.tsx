import React, { useEffect } from 'react'

import { usePianoTracker } from './PianoTrackerContext'
import { TrackingChapters, useTrackingChapters } from './TrackingChaptersContext'

// From https://github.com/nclsmitchell/at-internet
export function toAtString(string: string): string {
	string = string.replace(/ /g, '_').toLowerCase()
	string = string.replace(/[\300-\306]|[\340-\346]/g, 'a')
	string = string.replace(/[\310-\313]|[\350-\353]/g, 'e')
	string = string.replace(/[\314-\317]|[\354-\357]/g, 'i')
	string = string.replace(/[\322-\330]|[\362-\370]/g, 'o')
	string = string.replace(/[\331-\334]|[\371-\374]/g, 'u')
	string = string.replace(/[\307\347]/g, 'c')
	string = string.replace(/[\321\361]/g, 'n')
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
	const { chapter1, chapter2, chapter3 } = useTrackingChapters(chapters)
	const tracker = usePianoTracker()
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
