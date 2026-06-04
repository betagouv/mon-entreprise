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

export function useTrackingChapters(props: TrackingChapters): TrackingChapters {
	let chapters = useContext(TrackingChaptersContext)

	if (props.chapter1) {
		chapters = { chapter2: '', chapter3: '', ...props }
	}
	if (props.chapter2) {
		chapters = { ...chapters, chapter3: '', ...props }
	}
	if (props.chapter3) {
		chapters = { ...chapters, ...props }
	}

	return chapters
}

export function TrackingChaptersProvider({
	children,
	...chaptersProps
}: {
	children: React.ReactNode
} & TrackingChapters) {
	const chapters = useTrackingChapters(chaptersProps)

	return (
		<TrackingChaptersContext.Provider value={chapters}>
			{children}
		</TrackingChaptersContext.Provider>
	)
}
