import { useEffect, useState } from 'react'

// Refacto of https://github.com/gfmio/react-client-only/blob/master/index.ts

/** React hook that returns true if the component has mounted client-side */
export const useClientOnly = () => {
	const [hasMounted, setHasMounted] = useState(false)

	useEffect(() => setHasMounted(true), [])

	return hasMounted
}

/** React component that renders its children client-side only / after first mount */
export const ClientOnly = ({ children }: { children: React.ReactNode }) =>
	useClientOnly() ? children : null
