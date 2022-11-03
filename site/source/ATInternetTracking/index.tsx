import React, { createContext, useContext, useEffect } from 'react'

import { ATTracker, Log } from './Tracker'

export const TrackingContext = createContext<ATTracker>(new Log())

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

// Chapter definition : https://www.atinternet.com/en/glossary/chapter/
type Chapter1 =
	| 'simulateurs'
	| 'informations'
	| 'creer'
	| 'gerer'
	| 'documentation'
	| 'integration'
	| 'navigation'

type Chapters = {
	chapter1?: Chapter1
	chapter2?: string
	chapter3?: string
}

const PageChapterContext = createContext<Chapters>({})

function useChapters(props: Chapters): Chapters {
	let chapters = useContext(PageChapterContext)
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

export function TrackChapter({
	children,
	...chaptersProps
}: {
	chapter1?: Chapter1
	chapter2?: string
	chapter3?: string
	children: React.ReactNode
}) {
	const chapters = useChapters(chaptersProps)

	return (
		<PageChapterContext.Provider value={chapters}>
			{children}
		</PageChapterContext.Provider>
	)
}

export function TrackPage({
	name,
	children,
	...chapters
}: {
	name?: string
	children?: React.ReactNode
} & Chapters) {
	const { chapter1, chapter2, chapter3 } = useChapters(chapters)
	const tag = useContext(TrackingContext)
	useEffect(() => {
		tag.events.send(
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
	}, [tag, name, chapter1, chapter2, chapter3])

	return <>{children}</>
}
