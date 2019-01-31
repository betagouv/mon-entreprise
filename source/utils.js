/* @flow */
import { map } from 'ramda';

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

export const mapDispatchWithRouter = (actionCreators: Object) => (
	dispatch: (...any) => void,
	ownProps: Object
) =>
	map(
		actionCreator => (...args) =>
			dispatch(actionCreator(...args, ownProps.router)),
		actionCreators
	)

export function inIframe() {
	try {
		return window.self !== window.top
	} catch (e) {
		return true
	}
}

export const normalizeBasePath = (basePath: string) =>
	basePath + (basePath.endsWith('/') ? '' : '/')

export function softCatch<ArgType: any, ReturnType: any>(
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
				? (...args) => root + index + value(...args)
				: constructSitePaths(root + index, value),
		sitePaths
	)
})
