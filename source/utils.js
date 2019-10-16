/* @flow */
import { map } from 'ramda'

export let capitalise0 = (name: string) =>
	name && name[0].toUpperCase() + name.slice(1)

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

export function getSessionStorage() {
	// In some browsers like Brave, even just reading the variable sessionStorage
	// is throwing an error in the iframe, so we can't do things if sessionStorage !== undefined
	// and we need to wrap it in a try { } catch { } logic
	try {
		return window.sessionStorage
	} catch (e) {
		return undefined
	}
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
