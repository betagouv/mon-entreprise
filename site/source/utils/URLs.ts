export const getUrlDomain = (url: string): string =>
	new URL(url).hostname.replace('www.', '')
