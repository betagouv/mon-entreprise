export const getUrlDomain = (url: string): string =>
	new URL(url).hostname.replace('www.', '')

export const toBase64Url = (chaîne: string): string =>
	btoa(chaîne).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '')

const fromBase64Url = (chaîne: string): string => {
	const base64 = chaîne.replaceAll('-', '+').replaceAll('_', '/')
	const padding = '='.repeat((4 - (base64.length % 4)) % 4)

	return atob(base64 + padding)
}

export const parseSituationSérialisée = <T>(chaîne: string): Partial<T> => {
	try {
		const parsed: unknown = JSON.parse(fromBase64Url(chaîne))

		return typeof parsed === 'object' && parsed !== null ? (parsed as T) : {}
	} catch {
		return {}
	}
}
