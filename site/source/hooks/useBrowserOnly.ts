import { useEffect, useState } from 'react'

/**
 * React hook that returns true if the component has been mounted in a browser.
 */
export const useBrowserOnly = () => {
	const [hasMounted, setHasMounted] = useState(false)

	useEffect(() => setHasMounted(true), [])

	return hasMounted
}
