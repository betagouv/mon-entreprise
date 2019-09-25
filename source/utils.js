/* @flow */
import { map } from 'ramda'

export let capitalise0 = (name: string) => name[0].toUpperCase() + name.slice(1)

export let getUrl = () =>
	typeof window !== 'undefined' ? window.location.href.toString() : null

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
		hasOption = url?.includes(optionName + '=')
	return parseDataAttributes(
		hasOption && url.split(optionName + '=')[1].split('&')[0]
	)
}

export function isNumeric(val: number) {
	return Number(parseFloat(val)) === val
}

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

export function inIframe() {
	try {
		return window.self !== window.top
	} catch (e) {
		return true
	}
}

export function softCatch<ArgType: mixed, ReturnType: mixed>(
	fn: ArgType => ReturnType
): ArgType => ReturnType | null {
	return function(...args) {
		try {
			return fn(...args)
		} catch (e) {
			// eslint-disable-next-line no-console
			console.warn(e)
			return null
		}
	}
}
export function mapOrApply<A, B>(fn: A => B, x: Array<A> | A): Array<B> | B {
	return Array.isArray(x) ? x.map(fn) : fn(x)
}

export function coerceArray<A>(x: A | Array<A>): Array<A> {
	return Array.isArray(x) ? x : [x]
}

export const constructSitePaths = (
	root: string,
	{ index, ...sitePaths }: { index: string }
) => ({
	index: root + index,
	...map(
		value =>
			typeof value === 'string'
				? root + index + value
				: typeof value === 'function'
				? (...args) => mapOrApply(x => root + index + x, value(...args))
				: constructSitePaths(root + index, value),
		sitePaths
	)
})

export const getFromSessionStorage = softCatch<string, any>(where => {
	typeof sessionStorage !== 'undefined' ? sessionStorage[where] : null
})

export const setToSessionStorage = softCatch<string, void>((where, what) => {
	if (typeof sessionStorage !== 'undefined') {
		sessionStorage[where] = what
	}
})
