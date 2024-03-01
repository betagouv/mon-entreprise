export function formatDay(date: string | Date, language: string) {
	return new Date(date).toLocaleString(language, {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
	})
}
export function formatMonth(date: string | Date, language: string) {
	return new Date(date).toLocaleString(language, {
		month: 'long',
		year: 'numeric',
	})
}
export function formatIndicator(number: number, language: string) {
	return Intl.NumberFormat(language, {
		notation: 'compact',
	}).format(number)
}

export function formatProgression(
	previousValue: number,
	currentValue: number,
	language: string
) {
	return Intl.NumberFormat(language, {
		style: 'percent',
		signDisplay: 'exceptZero',
	}).format(currentValue / previousValue - 1)
}
export function emojiSatisfaction(satisfaction: number) {
	return satisfaction > 0.85
		? '😀'
		: satisfaction > 0.65
		? '🙂'
		: satisfaction > 0.5
		? '😐'
		: '😕'
}

export function messageTypeSatisfaction(satisfaction: number) {
	return satisfaction > 0.85
		? 'success'
		: satisfaction > 0.65
		? 'primary'
		: satisfaction > 0.5
		? 'info'
		: 'error'
}
