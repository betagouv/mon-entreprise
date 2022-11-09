import { useMatch } from 'react-router-dom'

export function useIsEmbedded(): boolean {
	try {
		if (useMatch('/iframes/*')) {
			return true
		}
	} catch (e) {
		// When useMatch is called outside ReactRouter context, it raise an error. We can safely ignore it.
	}
	if (import.meta.env.SSR) {
		return false
	}

	return !!new URLSearchParams(document.location.search.substring(1)).get(
		'iframe'
	)
}
