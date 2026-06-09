import { createContext, useContext } from 'react'

// Chapter definition : https://www.atinternet.com/en/glossary/chapter/
type Chapter1 =
	| 'simulateurs'
	| 'informations'
	| 'assistants'
	| 'documentation'
	| 'integration'
	| 'navigation'

export type TrackingChapters = {
	chapter1?: Chapter1
	chapter2?: string
	chapter3?: string
}

const TrackingChaptersContext = createContext<TrackingChapters>({})

export function useTrackingChapters(): TrackingChapters {
	return useContext(TrackingChaptersContext)
}

export const getTrackingChapters = (
	currentChapters: TrackingChapters,
	newChapters: TrackingChapters
): TrackingChapters => {
	const niveau1Changé = Boolean(newChapters.chapter1)
	const niveau2Changé = Boolean(newChapters.chapter2)

	return {
		chapter1: newChapters.chapter1 || currentChapters.chapter1,
		chapter2:
			newChapters.chapter2 || (niveau1Changé ? '' : currentChapters.chapter2),
		chapter3:
			newChapters.chapter3 ||
			(niveau1Changé || niveau2Changé ? '' : currentChapters.chapter3),
	}
}

export function TrackingChaptersProvider({
	children,
	...chaptersProps
}: {
	children: React.ReactNode
} & TrackingChapters) {
	const currentChapters = useTrackingChapters()
	const chapters = getTrackingChapters(currentChapters, chaptersProps)

	return (
		<TrackingChaptersContext.Provider value={chapters}>
			{children}
		</TrackingChaptersContext.Provider>
	)
}
