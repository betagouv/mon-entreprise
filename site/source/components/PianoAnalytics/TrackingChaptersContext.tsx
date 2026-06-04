import { createContext, useContext } from "react"

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

export const getTrackingChapters = (currentChapters: TrackingChapters, newChapters: TrackingChapters): TrackingChapters => {
	let chapters = currentChapters

	if (newChapters.chapter1) {
		chapters = { chapter2: '', chapter3: '', ...newChapters }
	}
	if (newChapters.chapter2) {
		chapters = { ...chapters, chapter3: '', ...newChapters }
	}
	if (newChapters.chapter3) {
		chapters = { ...chapters, ...newChapters }
	}

	return chapters
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
