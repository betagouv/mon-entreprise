export function normalizeDateString(dateString: string): string {
	let [day, month, year] = dateString.split('/')
	if (!year) {
		;[day, month, year] = ['01', day, month]
	}
	return normalizeDate(+year, +month, +day)
}
const pad = (n: number): string => (+n < 10 ? `0${n}` : '' + n)
export function normalizeDate(
	year: number,
	month: number,
	day: number
): string {
	const date = new Date(+year, +month - 1, +day)
	if (!+date || date.getDate() !== +day) {
		throw new SyntaxError(`La date ${day}/${month}/${year} n'est pas valide`)
	}
	return `${pad(day)}/${pad(month)}/${pad(year)}`
}

const dateRegexp = /[\d]{2}\/[\d]{2}\/[\d]{4}/
export function convertToDate(value: string): Date {
	const [day, month, year] = normalizeDateString(value).split('/')
	return new Date(+year, +month - 1, +day)
}
export function convertToDateIfNeeded(...values: string[]) {
	const dateStrings = values.map(dateString => '' + dateString)
	if (!dateStrings.some(dateString => dateString.match(dateRegexp))) {
		return values
	}
	dateStrings.forEach(dateString => {
		if (!dateString.match(dateRegexp)) {
			throw new TypeError(
				`'${dateString}' n'est pas une date valide (format attendu: mm/aaaa ou jj/mm/aaaa)`
			)
		}
	})
	return dateStrings.map(convertToDate)
}

export function convertToString(date: Date): string {
	return normalizeDate(date.getFullYear(), date.getMonth() + 1, date.getDate())
}

export function getRelativeDate(date: string, dayDifferential: number): string {
	const relativeDate = new Date(convertToDate(date))
	relativeDate.setDate(relativeDate.getDate() + dayDifferential)
	return convertToString(relativeDate)
}
