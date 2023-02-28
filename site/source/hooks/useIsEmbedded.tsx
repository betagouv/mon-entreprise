import { useMatch } from 'react-router-dom'

export function useIsEmbedded(): boolean {
	try {
		if (useMatch('/iframes/*')) {
			return true
		}
	} catch (e) {
		// When useMatch is called outside ReactRouter context, it raise an error. We can safely ignore it.
	}

	return false
}
