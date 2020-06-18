import { formatValue } from 'publicodes'

export function capitalise0(name: undefined): undefined
export function capitalise0(name: string): string
export function capitalise0(name?: string) {
	return name && name[0].toUpperCase() + name.slice(1)
}

export const debounce = <F extends (...args: any[]) => void>(
	waitFor: number,
	fn: F
) => {
	let timeoutId: ReturnType<typeof setTimeout>
	return (...args: any[]) => {
		clearTimeout(timeoutId)
		timeoutId = setTimeout(() => fn(...args), waitFor)
	}
}

export const fetcher = (url: RequestInfo) => fetch(url).then(r => r.json())

export function inIframe(): boolean {
	try {
		return window.self !== window.top
	} catch (e) {
		return true
	}
}

// We use this variable to hide some features in production while keeping them
// in feature-branches. In case we do A/B testing with several branches served
// in production, we should add the public faced branch names in the test below.
// This is different from the process.env.NODE_ENV in that a feature branch may
// be build in production mode (with the NODE_ENV) but we may still want to show
// or hide some features.
export const productionMode =
	process.env.HEAD && ['master', 'next'].includes(process.env.HEAD)

export function softCatch<ArgType, ReturnType>(
	fn: (arg: ArgType) => ReturnType
): (arg: ArgType) => ReturnType | null {
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

export function mapOrApply<A, B>(fn: (a: A) => B, x: A): B
export function mapOrApply<A, B>(fn: (a: A) => B, x: Array<A>): Array<B>
export function mapOrApply<A, B>(fn: (a: A) => B, x: A | Array<A>) {
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

export const currencyFormat = (language: string) => ({
	isCurrencyPrefixed: !!formatValue(12, { language, displayedUnit: '€' }).match(
		/^€/
	),
	thousandSeparator: formatValue(1000, { language }).charAt(1),
	decimalSeparator: formatValue(0.1, { language }).charAt(1)
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
