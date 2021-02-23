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

let chapters: {
	chapter1?: Chapter1
	chapter2?: string
	chapter3?: string
} = {}
export function TrackChapter(props: {
	chapter1?: Chapter1
	chapter2?: string
	chapter3?: string
}) {
	if (props.chapter1) {
		chapters = { chapter2: '', chapter3: '', ...props }
		return null
	}
	if (props.chapter2) {
		chapters = { ...chapters, chapter3: '', ...props }
		return null
	}

	chapters = { ...chapters, ...props }
	return null
}

export function TrackPage(props: {
	name?: string
	chapter1?: Chapter1
	chapter2?: string
	chapter3?: string
}) {
	const tag = useContext(TrackingContext)
	TrackChapter(props)
	const propsFormatted = Object.fromEntries(
		Object.entries({ ...chapters, name: props.name }).map(([k, v]) => [
			k,
			v && toAtString(v),
		])
	)
	useEffect(() => {
		tag.page.set(propsFormatted)
		tag.dispatch()
	}, [
		tag,
		propsFormatted.name,
		propsFormatted.chapter1,
		propsFormatted.chapter2,
		propsFormatted.chapter3,
	])
	return null
}
