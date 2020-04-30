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

export function convertToDate(value: string): Date {
	const [day, month, year] = normalizeDateString(value).split('/')
	const result = new Date(+year, +month - 1, +day)
	// Reset date to utc midnight for exact calculation of day difference (no
	// daylight saving effect)
	result.setMinutes(result.getMinutes() - result.getTimezoneOffset())
	return result
}

export function convertToString(date: Date): string {
	return normalizeDate(date.getFullYear(), date.getMonth() + 1, date.getDate())
}

export function getRelativeDate(date: string, dayDifferential: number): string {
	const relativeDate = new Date(convertToDate(date))
	relativeDate.setDate(relativeDate.getDate() + dayDifferential)
	return convertToString(relativeDate)
}

export function getYear(date: string): number {
	return +date.slice(-4)
}

export function getDifferenceInDays(from: string, to: string): number {
	const millisecondsPerDay = 1000 * 60 * 60 * 24
	return (
		1 +
		(convertToDate(from).getTime() - convertToDate(to).getTime()) /
			millisecondsPerDay
	)
}

export function getDifferenceInMonths(from: string, to: string): number {
	// We want to compute the difference in actual month between the two dates
	// For date that start during a month, a pro-rata will be done depending on
	// the duration of the month in days
	const [dayFrom, monthFrom, yearFrom] = from.split('/').map(x => +x)
	const [dayTo, monthTo, yearTo] = to.split('/').map(x => +x)
	const numberOfFullMonth = monthTo - monthFrom + 12 * (yearTo - yearFrom)
	const numDayMonthFrom = new Date(yearFrom, monthFrom, 0).getDate()
	const numDayMonthTo = new Date(yearTo, monthTo, 0).getDate()
	const prorataMonthFrom = (dayFrom - 1) / numDayMonthFrom
	const prorataMonthTo = dayTo / numDayMonthTo
	return numberOfFullMonth - prorataMonthFrom + prorataMonthTo
}

export function getDifferenceInYears(from: string, to: string): number {
	// Todo : take leap year into account
	return getDifferenceInDays(from, to) / 365.25
}
