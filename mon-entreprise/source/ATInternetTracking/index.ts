import { createContext, useContext, useEffect } from 'react'
import { ATTracker, Log } from './Tracker'

export const TrackingContext = createContext<ATTracker>(new Log())

// From https://github.com/nclsmitchell/at-internet
function toAtString(string: string): string {
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
type ChapterProp =
	| {
			level: 1
			name: Chapter1
	  }
	| { level: 2 | 3; name: string }

let chapters: {
	chapter1?: Chapter1
	chapter2?: string
	chapter3?: string
} = {}

export function TrackChapter(props: ChapterProp) {
	const chapterName = `chapter${props.level}`
	chapters = { ...chapters, [chapterName]: props.name }
	return null
}

export function TrackPage(props: {
	name: string
	chapter1?: Chapter1
	chapter2?: string
	chapter3?: string
}) {
	const tag = useContext(TrackingContext)
	const propsFormatted = Object.fromEntries(
		Object.entries(props).map(([k, v]) => [k, v && toAtString(v)])
	)
	useEffect(() => {
		tag.page.send({
			...chapters,
			...propsFormatted,
		})
		chapters = { chapter2: '', chapter3: '' }
	}, [props.name, props.chapter1, props.chapter2, props.chapter3])
	return null
}
