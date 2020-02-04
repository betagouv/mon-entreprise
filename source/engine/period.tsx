import { convertToDate } from 'Engine/date'

export type Period<Date> = {
	start: Date | null
	end: Date | null
}

export function parsePeriod<Date>(word: string, date: Date): Period<Date> {
	const startWords = [
		'depuis',
		'depuis le',
		'depuis la',
		'à partir de',
		'à partir du',
		'du'
	]
	const endWords = [
		"jusqu'à",
		"jusqu'au",
		"jusqu'à la",
		'avant',
		'avant le',
		'avant la',
		'au'
	]
	const intervalWords = ['le']
	if (!startWords.concat(endWords, intervalWords).includes(word)) {
		throw new SyntaxError(
			`Le mot clé '${word}' n'est pas valide. Les mots clés possible sont les suivants :\n\t ${startWords.join(
				', '
			)}`
		)
	}
	if (word === 'le') {
		return {
			start: date,
			end: date
		}
	}
	if (startWords.includes(word)) {
		return {
			start: date,
			end: null
		}
	}
	if (endWords.includes(word)) {
		return {
			start: null,
			end: date
		}
	}
	throw new Error('Non implémenté')
}

export function periodIntersection(
	parentPeriod: Period<{ nodeValue: string }> | null,
	childPeriod: Period<{ nodeValue: string }> | null
): Period<{ nodeValue: string }> {
	if (!parentPeriod) {
		return childPeriod || { start: null, end: null }
	}
	if (!childPeriod) {
		return parentPeriod || { start: null, end: null }
	}
	const startDateParent =
		parentPeriod.start?.nodeValue && convertToDate(parentPeriod.start.nodeValue)
	const startDateChild =
		childPeriod.start?.nodeValue && convertToDate(childPeriod.start.nodeValue)
	const endDateParent =
		parentPeriod.end?.nodeValue && convertToDate(parentPeriod.end.nodeValue)
	const endDateChild =
		childPeriod.end?.nodeValue && convertToDate(childPeriod.end.nodeValue)
	return {
		start:
			startDateChild == null || startDateParent > startDateChild
				? parentPeriod.start
				: childPeriod.start,
		end:
			endDateParent == null || endDateParent > endDateChild
				? childPeriod.end
				: parentPeriod.end
	}
}

export function isValidPeriod(period: Period<{ nodeValue: string }>): boolean {
	return (
		period.start?.nodeValue == null ||
		period.end?.nodeValue == null ||
		convertToDate(period.end.nodeValue) >= convertToDate(period.start.nodeValue)
	)
}
