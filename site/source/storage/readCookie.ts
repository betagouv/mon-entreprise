// From https://stackoverflow.com/a/25490531
export function getCookieValue(cookieName: string) {
	return (
		document.cookie
			.match('(^|;)\\s*' + cookieName + '\\s*=\\s*([^;]+)')
			?.pop() || ''
	)
}
