/* @flow */

export let capitalise0 = (name: string) => name[0].toUpperCase() + name.slice(1)

export let getUrl = () => window.location.href.toString()

export let parseDataAttributes = (value: any) =>
	value === 'undefined'
		? undefined
		: value === null
			? null
			: !isNaN(value)
				? +value
				: /* value is a normal string */
				  value

export let getIframeOption = (optionName: string) => {
	let url = getUrl(),
		hasOption = url.includes(optionName + '=')
	return parseDataAttributes(
		hasOption && url.split(optionName + '=')[1].split('&')[0]
	)
}

// By luck this works as expected for both null and undefined, * but with different branches failing :O *
export let isFloat = (n: number) => Number(n) === n && n % 1 !== 0

export function debounce<ArgType: any>(
	timeout: number,
	fn: ArgType => void
): ArgType => void {
	let timeoutId
	return (...args) => {
		clearTimeout(timeoutId)
		timeoutId = setTimeout(() => fn(...args), timeout)
	}
}

export function isIE() {
	return (
		navigator.appName == 'Microsoft Internet Explorer' ||
		(navigator.appName == 'Netscape' &&
			new RegExp('Trident/.*rv:([0-9]{1,}[.0-9]{0,})').exec(
				navigator.userAgent
			) != null)
	)
}
