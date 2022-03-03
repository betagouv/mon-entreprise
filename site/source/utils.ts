import { formatValue } from 'publicodes'

export function capitalise0(name: undefined): undefined
export function capitalise0(name: string): string
export function capitalise0(name?: string) {
	return name && name[0].toUpperCase() + name.slice(1)
}

export const debounce = <T>(waitFor: number, fn: (...args: T[]) => void) => {
	let timeoutId: ReturnType<typeof setTimeout>
	return (...args: T[]) => {
		clearTimeout(timeoutId)
		timeoutId = setTimeout(() => fn(...args), waitFor)
	}
}

export const fetcher = (url: RequestInfo) => fetch(url).then((r) => r.json())

export function inIframe(): boolean {
	try {
		return window.self !== window.top
	} catch (e) {
		return true
	}
}

export function softCatch<ArgType, ReturnType>(
	fn: (arg: ArgType) => ReturnType
): (arg: ArgType) => ReturnType | null {
	return function (...args) {
		try {
			return fn(...args)
		} catch (e) {
			// eslint-disable-next-line no-console
			console.warn(e)
			return null
		}
	}
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

export const currencyFormat = (language: string) => ({
	isCurrencyPrefixed: !!formatValue(12, { language, displayedUnit: '€' }).match(
		/^€/
	),
	thousandSeparator: formatValue(1000, { language }).charAt(1),
	decimalSeparator: formatValue(0.1, { language }).charAt(1),
})

export function hash(str: string): number {
	let hash = 0
	let chr
	for (let i = 0; i < str.length; i++) {
		chr = str.charCodeAt(i)
		hash = (hash << 5) - hash + chr
		hash |= 0 // Convert to 32bit integer
	}
	return hash
}

export function omit<T, K extends keyof T>(obj: T, key: K): Omit<T, K> {
	const returnObject = { ...obj }
	delete returnObject[key]
	return returnObject
}

export function isIterable<T>(obj: unknown): obj is Iterable<T> {
	return Symbol.iterator in Object(obj)
}

/**
 * Check if a key exists in the object and return its value or undefined,
 * usefull for type check
 * @param obj any object
 * @param key key to get value from object
 * @returns value or undefined
 */
export const getValueFrom = <
	T extends Record<string | number | symbol, unknown>,
	K extends string | number | symbol
>(
	obj: T,
	key: K
): Extract<T, { [k in K]?: unknown }>[K] | undefined =>
	key in obj ? obj[key] : undefined
