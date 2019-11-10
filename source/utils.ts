export let capitalise0 = (name: string): string =>
	name && name[0].toUpperCase() + name.slice(1)

export function debounce<ArgType>(
	timeout: number,
	fn: (arg: ArgType) => void
): (arg: ArgType) => void {
	let timeoutId: ReturnType<typeof setTimeout>
	return (...args) => {
		clearTimeout(timeoutId)
		timeoutId = setTimeout(() => fn(...args), timeout)
	}
}

export function isIE(): boolean {
	return (
		navigator.appName == 'Microsoft Internet Explorer' ||
		(navigator.appName == 'Netscape' &&
			new RegExp('Trident/.*rv:([0-9]{1,}[.0-9]{0,})').exec(
				navigator.userAgent
			) != null)
	)
}

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
export function mapOrApply<A, B>(
	fn: (a: A) => B,
	x: Array<A> | A
): Array<B> | B {
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
